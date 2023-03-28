// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  BindingScope,
  ContextTags,
  inject,
  injectable,
  LifeCycleObserver,
  lifeCycleObserver
} from '@loopback/core';
import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {plainToClass} from 'class-transformer';
import {DbDataSource} from '../datasources';
import {RecipeInput} from '../graphql-types/recipe-input';
import {Recipe} from '../graphql-types/recipe-type';

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES},
})
@lifeCycleObserver('repository')
export class RecipeRepository
  extends DefaultCrudRepository<Recipe, typeof Recipe.prototype.id, {}>
  implements LifeCycleObserver {

  @inject('recipes')
  private sampleRecipes: Recipe[];

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Recipe, dataSource);
  }

  async start() {
    try {
      await this.createAll(this.sampleRecipes);
      // Increase the counter to avoid duplicate keys
    }
    catch { }

  }

  stop() {
    // Reset the id counter
  }

  async getAll() {
    return this.find();
  }

  async getOne(id: string) {
    return this.findById(id);
  }

  async add(data: RecipeInput) {
    const recipe = this.createRecipe(data);
    return this.create(recipe);
  }

  async findIndex(recipe: Recipe) {
    const recipes = await this.find();
    return recipes.findIndex(r => r.id === recipe.id);
  }

  private createRecipe(recipeData: Partial<Recipe>): Recipe {
    const recipe = plainToClass(Recipe, recipeData);
    recipe.creationDate = new Date('2020-05-24');
    recipe.ratings = [2, 4];
    return recipe;
  }


}
