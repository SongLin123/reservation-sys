import{c as pe,a as ve,b as E,d as a,i as G,e as L,f,g as J,h as Q,u as me,j as Z,k as we,r as A,t as ye,l as xe,m as F,n as Se,o as D,p as r,q as x,N as ke,s as Ce,v as M,w as S,x as H,y as g,z as _e,A as l,B as Be,C as Re,D as O,E as X,F as T,G as j}from"./index-133e18d7.js";const $e={buttonHeightSmall:"14px",buttonHeightMedium:"18px",buttonHeightLarge:"22px",buttonWidthSmall:"14px",buttonWidthMedium:"18px",buttonWidthLarge:"22px",buttonWidthPressedSmall:"20px",buttonWidthPressedMedium:"24px",buttonWidthPressedLarge:"28px",railHeightSmall:"18px",railHeightMedium:"22px",railHeightLarge:"26px",railWidthSmall:"32px",railWidthMedium:"40px",railWidthLarge:"48px"},Ve=e=>{const{primaryColor:c,opacityDisabled:h,borderRadius:s,textColor3:n}=e,p="rgba(0, 0, 0, .14)";return Object.assign(Object.assign({},$e),{iconColor:n,textColor:"white",loadingColor:c,opacityDisabled:h,railColor:p,railColorActive:c,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:s,railBorderRadiusMedium:s,railBorderRadiusLarge:s,buttonBorderRadiusSmall:s,buttonBorderRadiusMedium:s,buttonBorderRadiusLarge:s,boxShadowFocus:`0 0 0 2px ${ve(c,{alpha:.2})}`})},Ue={name:"Switch",common:pe,self:Ve},Fe=Ue,ze=E("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[a("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),a("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),a("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),E("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[G({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),a("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),a("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),a("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),L("&:focus",[a("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),f("round",[a("rail","border-radius: calc(var(--n-rail-height) / 2);",[a("button","border-radius: calc(var(--n-button-height) / 2);")])]),J("disabled",[J("icon",[f("rubber-band",[f("pressed",[a("rail",[a("button","max-width: var(--n-button-width-pressed);")])]),a("rail",[L("&:active",[a("button","max-width: var(--n-button-width-pressed);")])]),f("active",[f("pressed",[a("rail",[a("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),a("rail",[L("&:active",[a("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),f("active",[a("rail",[a("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),a("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[a("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[G()]),a("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),f("active",[a("rail","background-color: var(--n-rail-color-active);")]),f("loading",[a("rail",`
 cursor: wait;
 `)]),f("disabled",[a("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Ne=Object.assign(Object.assign({},Z.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let R;const Ie=Q({name:"Switch",props:Ne,setup(e){R===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?R=CSS.supports("width","max(1px)"):R=!1:R=!0);const{mergedClsPrefixRef:c,inlineThemeDisabled:h}=me(e),s=Z("Switch","-switch",ze,Fe,e,c),n=we(e),{mergedSizeRef:p,mergedDisabledRef:t}=n,d=A(e.defaultValue),u=ye(e,"value"),b=xe(u,d),_=F(()=>b.value===e.checkedValue),k=A(!1),i=A(!1),v=F(()=>{const{railStyle:o}=e;if(!!o)return o({focused:i.value,checked:_.value})});function m(o){const{"onUpdate:value":$,onChange:V,onUpdateValue:U}=e,{nTriggerFormInput:z,nTriggerFormChange:N}=n;$&&M($,o),U&&M(U,o),V&&M(V,o),d.value=o,z(),N()}function ee(){const{nTriggerFormFocus:o}=n;o()}function te(){const{nTriggerFormBlur:o}=n;o()}function ae(){e.loading||t.value||(b.value!==e.checkedValue?m(e.checkedValue):m(e.uncheckedValue))}function oe(){i.value=!0,ee()}function ie(){i.value=!1,te(),k.value=!1}function ne(o){e.loading||t.value||o.key===" "&&(b.value!==e.checkedValue?m(e.checkedValue):m(e.uncheckedValue),k.value=!1)}function re(o){e.loading||t.value||o.key===" "&&(o.preventDefault(),k.value=!0)}const K=F(()=>{const{value:o}=p,{self:{opacityDisabled:$,railColor:V,railColorActive:U,buttonBoxShadow:z,buttonColor:N,boxShadowFocus:le,loadingColor:se,textColor:ce,iconColor:de,[S("buttonHeight",o)]:w,[S("buttonWidth",o)]:ue,[S("buttonWidthPressed",o)]:he,[S("railHeight",o)]:y,[S("railWidth",o)]:B,[S("railBorderRadius",o)]:be,[S("buttonBorderRadius",o)]:fe},common:{cubicBezierEaseInOut:ge}}=s.value;let I,P,W;return R?(I=`calc((${y} - ${w}) / 2)`,P=`max(${y}, ${w})`,W=`max(${B}, calc(${B} + ${w} - ${y}))`):(I=H((g(y)-g(w))/2),P=H(Math.max(g(y),g(w))),W=g(y)>g(w)?B:H(g(B)+g(w)-g(y))),{"--n-bezier":ge,"--n-button-border-radius":fe,"--n-button-box-shadow":z,"--n-button-color":N,"--n-button-width":ue,"--n-button-width-pressed":he,"--n-button-height":w,"--n-height":P,"--n-offset":I,"--n-opacity-disabled":$,"--n-rail-border-radius":be,"--n-rail-color":V,"--n-rail-color-active":U,"--n-rail-height":y,"--n-rail-width":B,"--n-width":W,"--n-box-shadow-focus":le,"--n-loading-color":se,"--n-text-color":ce,"--n-icon-color":de}}),C=h?Se("switch",F(()=>p.value[0]),K,e):void 0;return{handleClick:ae,handleBlur:ie,handleFocus:oe,handleKeyup:ne,handleKeydown:re,mergedRailStyle:v,pressed:k,mergedClsPrefix:c,mergedValue:b,checked:_,mergedDisabled:t,cssVars:h?void 0:K,themeClass:C?.themeClass,onRender:C?.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:c,checked:h,mergedRailStyle:s,onRender:n,$slots:p}=this;n?.();const{checked:t,unchecked:d,icon:u,"checked-icon":b,"unchecked-icon":_}=p,k=!(D(u)&&D(b)&&D(_));return r("div",{role:"switch","aria-checked":h,class:[`${e}-switch`,this.themeClass,k&&`${e}-switch--icon`,h&&`${e}-switch--active`,c&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},r("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:s},x(t,i=>x(d,v=>i||v?r("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},r("div",{class:`${e}-switch__rail-placeholder`},r("div",{class:`${e}-switch__button-placeholder`}),i),r("div",{class:`${e}-switch__rail-placeholder`},r("div",{class:`${e}-switch__button-placeholder`}),v)):null)),r("div",{class:`${e}-switch__button`},x(u,i=>x(b,v=>x(_,m=>r(ke,null,{default:()=>this.loading?r(Ce,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(v||i)?r("div",{class:`${e}-switch__button-icon`,key:v?"checked-icon":"icon"},v||i):!this.checked&&(m||i)?r("div",{class:`${e}-switch__button-icon`,key:m?"unchecked-icon":"icon"},m||i):null})))),x(t,i=>i&&r("div",{key:"checked",class:`${e}-switch__checked`},i)),x(d,i=>i&&r("div",{key:"unchecked",class:`${e}-switch__unchecked`},i)))))}}),Y="naive-ui-template:setup-api:url",q="naive-ui-template:setup-api:gateway",We=Q({setup(){const e=_e({apiUrl:localStorage.getItem("__api")||"",gatewayUrl:localStorage.getItem("__gateway")||"",persist:!1}),c=()=>{const t=new URL(location.href),{apiUrl:d,gatewayUrl:u,persist:b}=e;d&&t.searchParams.set("__api",d),u&&t.searchParams.set("__gateway",u),b&&(d&&localStorage.setItem("__api",d),u&&localStorage.setItem("__gateway",u)),t.pathname="/",t.hash="",localStorage.setItem(Y,JSON.stringify([...new Set(n.concat(d))])),localStorage.setItem(q,JSON.stringify([...new Set(n.concat(u))])),location.href=t.toString()},h=()=>{localStorage.removeItem("__api"),localStorage.removeItem("__gateway"),location.href="/"},s=()=>{e.apiUrl="http://localhost:2333",e.gatewayUrl="http://localhost:2333"},n=JSON.safeParse(localStorage.getItem(Y)||"[]"),p=JSON.safeParse(localStorage.getItem(q)||"[]");return()=>l("div",{class:"relative h-screen w-full flex items-center justify-center"},[l(Be,{title:"\u8BBE\u7F6E API",class:"modal-card sm m-auto form-card"},{default:()=>[l(Re,{onSubmit:c},{default:()=>[l(O,{label:"API \u5730\u5740"},{default:()=>[l(X,{options:n.map(t=>({key:t,value:t,label:t})),filterable:!0,tag:!0,clearable:!0,value:e.apiUrl,onUpdateValue:t=>{e.apiUrl=t}},null)]}),l(O,{label:"Gateway \u5730\u5740"},{default:()=>[l(X,{tag:!0,options:p.map(t=>({key:t,value:t,label:t})),filterable:!0,clearable:!0,value:e.gatewayUrl,onUpdateValue:t=>{e.gatewayUrl=t}},null)]}),l(O,{label:"\u6301\u4E45\u5316",labelPlacement:"left"},{default:()=>[l(Ie,{value:e.persist,onUpdateValue:t=>{e.persist=t}},null)]}),l("div",{class:"text-center space-x-2"},[l(T,{onClick:s,round:!0},{default:()=>[j("\u672C\u5730\u8C03\u8BD5")]}),l(T,{onClick:h,round:!0},{default:()=>[j("\u91CD\u7F6E")]}),l(T,{onClick:c,round:!0,type:"primary"},{default:()=>[j("\u786E\u5B9A")]})])]})]})])}});export{We as default};
