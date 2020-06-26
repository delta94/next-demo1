import "reflect-metadata";
import {Post} from "src/entity/Post";
import {User} from "src/entity/User";
import {Comment} from "src/entity/Comment";
import {createConnection, getConnectionManager} from "typeorm";
import config from 'ormconfig.json'

const promise = (async function () {
  const manage = getConnectionManager()
  if (manage.has('default')) {
    const connection = manage.get('default')
    await connection.close()
  }
  // @ts-ignore
  return createConnection({
    ...config,
    entities: [Post, User, Comment]
  })
})()

export const getDatabaseConnection = async () => {
  return promise
}
