
## Composite Primary Keys in Cassandra

### About this example

This code was generated using the JHipster blueprint `generator-jhipster-cassandra-composite-primary-key` 
(the source code is available at: https://github.com/amarpatel-xx/generator-jhipster-cassandra-composite-primary-key).  

The blueprint for generating the composite primary key with Cassandra entities is open source software made with love by `Amar Premsaran Patel`.


This code in this example has a `JDL` which shows 
- 2 Cassandra entities that have composite primary keys
- 3 Cassandra entities that have single-value primary keys. 

The example entities in the JDL is based on Matt Raible's frequently used examples in his capability demonstrations.  The current blueprint only
supports a single field of type `PrimaryKeyType.PARTITIONED` a field which is the partition column is specified as such with the `@customAnnotation("PrimaryKeyType.PARTITIONED")` custom annotation. 

In the future, the blueprint can be modified to support multiple fields with `PrimaryKeyType.PARTITIONED` types. 
Nevertheless, if a entity needs to specify additional fields with type `PrimaryKeyType.CLUSTERED`, they
are specified using `@customAnnotation("PrimaryKeyType.CLUSTERED")`. 

There are no relationships between Cassandra entities, as such relationships cannot be specified.  The blueprint that this example utilizes also support `CassandraType.Name.SET`.

Below is the example using the `@customAnnotation` methodology to specify the details of the Cassandra composite primary key.


```shell
// Composite Primary Key Example:
entity Post {
  @Id @customAnnotation("PrimaryKeyType.PARTITIONED") @customAnnotation("CassandraType.Name.BIGINT") @customAnnotation("UTC_DATE") @customAnnotation("0") createdDate Long 
  // Do not name composite primary key fields as 'id' as it conflicts with the 'id' field in the JHipster entity.
  @customAnnotation("PrimaryKeyType.CLUSTERED") @customAnnotation("CassandraType.Name.BIGINT") @customAnnotation("UTC_DATETIME") @customAnnotation("1") addedDateTime Long
  @customAnnotation("PrimaryKeyType.CLUSTERED") @customAnnotation("CassandraType.Name.UUID") @customAnnotation("") @customAnnotation("2") postId UUID
  @customAnnotation("") @customAnnotation("CassandraType.Name.TEXT") @customAnnotation("") @customAnnotation("") title String required
  @customAnnotation("") @customAnnotation("CassandraType.Name.TEXT") @customAnnotation("") @customAnnotation("") content String required
}

// Single-value Primary Key Example:
entity Product {
  // Primary Key field can be named 'id'.  JHipster natively supports single-value primary keys.  This blueprint also supports single-value primary keys.
  @Id @customAnnotation("PrimaryKeyType.PARTITIONED") @customAnnotation("CassandraType.Name.UUID") @customAnnotation("") @customAnnotation("") id UUID
  @customAnnotation("") @customAnnotation("CassandraType.Name.TEXT") @customAnnotation("") @customAnnotation("") title String required
  @customAnnotation("") @customAnnotation("CassandraType.Name.DECIMAL") @customAnnotation("") @customAnnotation("") price BigDecimal required min(0)
  @customAnnotation("") @customAnnotation("CassandraType.Name.BLOB") @customAnnotation("image") @customAnnotation("") image ImageBlob
  @customAnnotation("") @customAnnotation("CassandraType.Name.DATE") @customAnnotation("") @customAnnotation("") addedDate LocalDate required
  @customAnnotation("") @customAnnotation("CassandraType.Name.BIGINT") @customAnnotation("UTC_DATETIME") @customAnnotation("") addedDateTime Long
}
```

### Prerequisites

- https://sdkman.io/[Java] 21+
- https://nodejs.com/[Node.js] 20+
- https://www.docker.com/products/docker-desktop/[Docker Desktop]
- https://www.jhipster.tech/installation/[JHipster] 8.5.0

### Build

Build Java Microservices using the Cassandra Composite Primary Key Blueprint

- To generate a microservices architecture with Cassandra composite primary key support, run the following command:

```console
sh saathratri-generate-code-dev-cassandra.sh
```

- You should see the message:

```console
Congratulations, JHipster execution is complete!
```

### Run your Cassandra Composite Primary Key Entities Example

-  When the process is complete, cd into the `gateway` directory and start Keycloak and Eureka using Docker Compose.

```console
cd gateway
docker compose -f src/main/docker/keycloak.yml up -d
docker compose -f src/main/docker/jhipster-registry.yml up -d
```

- Start `gateway` database with Docker by opening a terminal and navigating to its directory and running the Docker command. Then start the `gateway` by running the Maven command.

```console
npm run docker:db:up
./mvnw spring-boot:run
```

-  Start `blog` database with Docker by opening a terminal and navigating to its directory and running the Docker command. Then, start the `blog` microservice.

```console
cd blog
npm run docker:db:up
./mvnw spring-boot:run
```

-  Start `store` database with Docker by opening a terminal and navigating to its directory and running the Docker command. Then, start the `store` microservice.

```console
cd store
npm run docker:db:up
./mvnw spring-boot:run
```
 
### Identity Providers

JHipster ships with Keycloak when you choose OAuth 2.0 / OIDC as the authentication type.

#### See the Code in Action

Now you can open your favorite browser to http://localhost:8080, and log in with the credentials displayed on the page.

Then create a Blog

- Open your favorite browser to http://localhost:8080, and log in with the credentials displayed on the page.  
- Then, add a blog by giving it a name, handle and selecting a user.
- Add a tag by giving it a name.
- Finally, create a post by giving it a title, content, selecting a blog and a tag.

Notice the Blog entity shows the required category and blogId composite primary key fields.  That is success!

### What's Next?

I hope you enjoyed this demo, and it helped you understand how to build better microservice architectures with human-readable foreign key fields.

☕️ Find the code on GitHub: https://github.com/amarpatel-xx/jhipster-cassandra-composite-primary-key-example-8-oss

🤓 Read the following blog post, by Matt Raible, that was used as inspiration for this project: https://auth0.com/blog/micro-frontends-for-java-microservices/[Micro Frontends for Java Microservices]

### Acknowledgements

Thank you to yelhouti (https://github.com/yelhouti), Jeremy Artero (https://www.linkedin.com/in/jeremyartero/), Matt Raible (https://github.com/mraible), Gaël Marziou (https://github.com/gmarziou), [Cedrick](https://github.com/clun) , Christophe, and Disha Patel (https://www.linkedin.com/in/dishapatel860/) for your invaluable contributions to this example and the underlying JHipster blueprint.