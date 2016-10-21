## Meteor install

[Official page](https://www.meteor.com/install) or run this at terminal ```https://install.meteor.com/ | sh```

## Current Tutorial

[Current Tutorial](http://meteortips.com/second-meteor-tutorial/)

## Router in tutorial

There are two packages which can be used: [Iron Router](https://atmospherejs.com/iron/router) and [Flow Router](https://atmospherejs.com/meteorhacks/flow-router).

Autor used Iron Router and add it by this command: ```meteor add iron:router```

## User accounts

Install by executing this at terminal:

``` meteor add accounts-password ```
and
``` meteor add accounts-ui ```

``` var currentUser = Meteor.userId(); ```

## Some tips

 * ``` meteor reset ``` -  reset meteor database
 * By default, all of the data within new project’s database – is readily accessible within the Console.
 * ``` meteor remove autopublish ``` - remove full access for data from console
 * ``` Meteor.publish('lists'); ``` - add list for publishing
 * ``` Meteor.subscribe('lists'); ``` - make list accesible
 * ``` meteor remove insecure ``` - remove posibility to insert, update, remove from web browser, access only from server(for using all actions should use methods in server part of application)


### Quotation

There’s this myth that developers have an inherent, encyclopedic knowledge of everything they need to write code, but it’s not true. Good developers are simply curious and persistent people who don’t crumble at the sight of a problem, but rather thrive at the sight of something to learn.

– David Turnbull