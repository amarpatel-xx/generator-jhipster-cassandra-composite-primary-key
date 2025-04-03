# generator-jhipster-cassandra-composite-primary-key

> JHipster blueprint, cassandra-composite-primary-key blueprint for JHipster.

# Project Update

This project has been renamed and relocated to a new repository: https://github.com/amarpatel-xx/generator-jhipster-cassandra.
Additionally, the JHipster Blueprint example has been moved to: https://github.com/amarpatel-xx/jhipster-cassandra-example.

Please note that all future updates and developments will be available exclusively at these new locations.

# Introduction

This is a [JHipster](https://www.jhipster.tech/) blueprint, that is meant to be used in a JHipster application.

The generator-jhipster-cassandra-composite-primary-key is an open-source project that extends JHipster’s capabilities to support Cassandra databases with composite primary keys. This generator provides functionality to define and use composite primary keys in Cassandra entities, which are essential when designing schemas that require multiple fields as part of the primary key.

Key Features:
- Support for Composite Primary Keys:
	  Allows defining entities with composite primary keys, which consist of multiple columns, enabling more complex data modeling in Cassandra.
- Custom Code Generation:
	  Generates JHipster entities and associated files tailored to work with composite primary keys.
- Integration with Cassandra:
	  Ensures seamless integration with Cassandra’s specific requirements for primary key design, including partition keys and clustering columns.
- Simplified Development:
	  Automates boilerplate code creation, reducing the effort needed to configure composite primary keys manually.

Use Case:

This generator is particularly useful in scenarios where Cassandra is used as the database, and the application needs to:
- Group data using partition keys for efficient queries.
- Use clustering columns to organize data within partitions.

Example:

If you’re designing an entity, such as Order, that requires both orderId and productId to uniquely identify an order, this generator can help you define these fields as a composite primary key.

For further details or updates, you can visit the npm page of the generator.

# Prerequisites

As this is a [JHipster](https://www.jhipster.tech/) blueprint, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://www.jhipster.tech/installation/)

# Installation

To install or update this blueprint:

```console
npm install -g generator-jhipster-cassandra-composite-primary-key
```

# Usage

To use this blueprint, run the below command

```console
jhipster --blueprints cassandra-composite-primary-key
```

You can look for updated cassandra-composite-primary-key blueprint specific options by running

```console
jhipster app --blueprints cassandra-composite-primary-key --help
```

And looking for `(blueprint option: cassandra-composite-primary-key)` like

# Open Source Software - See the Code

☕️ Find the example code to run this blueprint/generator on GitHub:
[https://github.com/amarpatel-xx/jhipster-cassandra-composite-primary-key-example](https://github.com/amarpatel-xx/jhipster-cassandra-composite-primary-key-example)

☕️ Find the JHipster blueprint/generator code on GitHub:
[https://github.com/amarpatel-xx/generator-jhipster-cassandra-composite-primary-key](https://github.com/amarpatel-xx/generator-jhipster-cassandra-composite-primary-key)
