const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

const typeDefs = gql`
type User  {
  name: Name
  location: Location
  picture: Picture
  email: String
  phone: String
  gender: String
  nat: String
}

type Name  {
  title: String
  first: String
  last: String
}

type Location  {
  street: String
  city: String
  state: String
}

type Picture  {
  large: String
  medium: String
  thumbnail: String
}

type Query {
  getUser: User
  getUsers(people: Int): [User]
}
`

const resolvers = {
  Query: {
    getUser: (_, args, { dataSources }) => {
      return dataSources.RandomUser.getUser();
    },
    getUsers: (_, { people },{ dataSources }) => {
      return dataSources.RandomUser.getUsers(people);
    }
  }
}

class RandomUser extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://randomuser.me/api';
    }
    async getUser() {
      const responseData = await this.get('/')
      return responseData.results[0]
    }

    async getUsers(people = 30) {
      const responseData = await this.get(`/?results=${people}`)
      return responseData.results
    }
}

const server =  new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    RandomUser: new RandomUser()
  })
})

server.listen()