# Docker NGINX compose

## Introduction

Docker compose kick-starting set.

## Set up

* **NGINX**: Latest from docker hub.
* **PHP 7-fpm**: Optimized version 7.4.4
* **Percona**: Version 5.7

## Create a the project

Create a new project with composer. **Replace the ${project_name} with your project**. That will be the root directory of your application:
`composer create-project catchdigital/drucker ${project_name}`

_If the settings.php file is updated in Drupal core, you'll need to uncomment the last 3 lines of settings.php to include the settings.local.php_

## Updating the project

An .env file should be created as a copy of .env.example. Feel free to add/update any variables as your needs.

Run docker compose
`docker-compose up -d server`

If you have the domain in your hosts file, you should be able to hit the site on **https://vm.localhost/** or whatever domain you want to run the site.

## Other useful commands

Stop docker stack
`docker-compose stop`

Destroy the whole docker stack. This also delete the database.
`docker-compose down`

## Next steps

Install the contrib themes if needed, create your custom theme, and update webpack with your ${theme} name.

After that, you should be able to build the css and javascript from the root of the project: `npm run build`. That will generate the files in a build folder in the theme. Don't forget to create add the build files to your libraries and create different entrypoints for each of your libraries, so they can be splitted around the twig templates.

In oder to add dynamically the dependencies for each entrypoint, you should add the following hook to your theme.

```
/**
 *
 * Implements hook_library_info_alter() for webpack chunks dependencies.
 */
function hook_library_info_alter(&$libraries, $extension) {
  // We only want to modify current theme extensions
  if ($extension === '${theme') {
    // Load chunks dependencies from stats file.
    $stats = file_get_contents(DRUPAL_ROOT . "/../webpack.stats.json");
    $stats = Json::decode($stats);
    // Create and attach code splits.
    foreach($stats['namedChunkGroups'] as $name => $lib) {
      // Loop through require files.
      $reqAssets = $lib['assets'];
      if (isset($libraries[$name])) {
        $libraries = addNewLibrary($libraries, $reqAssets, $name);
      }
    }
  }
}
```

_The individual library for each entry point must be created manually based on the definition on webpack, and they shuold use the same name. If using catchify theme, this is happening automatically._