import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';


// auth jwt
import {AuthenticationComponent, registerAuthenticationStrategy, UserService} from '@loopback/authentication';
import {
  JWTAuthenticationComponent, RefreshTokenServiceBindings, UserServiceBindings
} from '@loopback/authentication-jwt';
import {DbDataSource} from './datasources';
import {MyUser} from './models';
import {MyUserRepository} from './repositories';
import {MyUserCredentialsRepository} from './repositories/my-user-credentials.repository';
// import {JwtLoginService} from './services/jwt-login.service';
import {format, LoggingBindings, LoggingComponent} from '@loopback/logging';
import {initDB} from './initDB';
import {IsGuestAuthenticationStrategy} from './is-guest.auth';
import {RestInfoMiddlewareProvider} from './middleware/rest-info.middleware';
import {MyAuthStrategyProvider} from './my-auth-strategy-provider';
import {CreateRecordVerificationService} from './services';
import {Credentials, MyUserService} from './services/user.service';

export {ApplicationConfig};

export class ReservationSysApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {
  }) {
    super(options);

    this.add(createBindingFromClass(RestInfoMiddlewareProvider));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true
      },
    };


    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);


    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: true,
    });

    this.configure(LoggingBindings.WINSTON_LOGGER).to({
      level: 'warning',
      format: format.json(),
      defaultMeta: {framework: 'LoopBack'},
    });
    // logging
    this.component(LoggingComponent);



    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.dataSource(DbDataSource, RefreshTokenServiceBindings.DATASOURCE_NAME);


    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      MyUserCredentialsRepository,
    )
    this.bind<UserService<MyUser, Credentials>>(UserServiceBindings.USER_SERVICE).toClass(MyUserService)
    // Bind user and credentials repository
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(
      MyUserRepository,
    )



    // 注册鉴权器
    registerAuthenticationStrategy(this, IsGuestAuthenticationStrategy);
    registerAuthenticationStrategy(this, MyAuthStrategyProvider);


    // 绑定
    this.bind('services.CreateRecordVerificationService').toClass(CreateRecordVerificationService).inScope(BindingScope.SINGLETON);

  }

  async boot() {
    await super.boot();

    const dataSource = this.getSync<DbDataSource>('datasources.db');

    await dataSource.connect()

    // 初始化数据
    await initDB(dataSource);



    console.log('server start!!')
  }


}
