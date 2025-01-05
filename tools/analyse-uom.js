/*
RUN: node analyse-uom.js
PURPOSE: This script will list all the `uom` (unit of measure) within the
         schemas of the papiNet API OpenAPI documentation.
*/

const fs = require('fs');
const YAML = require('yaml');

const file = fs.readFileSync('../3.0.0/papiNet-API.yaml', 'utf8');

const doc = YAML.parse(file);

dumpKeys('', doc.components.schemas);

function dumpKeys(context, current) {
  for (key in current) {
    if (current[key].type == 'object' || current[key].type == 'array') {

      if (current[key].type == 'object') {
        if (key != 'items') {
          newContext = context + (context.length != 0?".":"") + key;
        }
      }
      if (current[key].type == 'array') {
        newContext = context + (context.length != 0?".":"") + key + "[]";
      }

      if (current[key].properties && current[key].properties.uom) {
        if (key != 'items') {
          console.log(`- \`${context}.${key}.uom\`:`);
        } else {
          console.log(`- \`${context}.uom\`:`);
        }
        for (uom of current[key].properties.uom.enum) {
          console.log(`  - \`${uom}\``);
        }
        newContext = '';
      }
    }
    if (typeof(current[key]) == 'object') {
      dumpKeys(newContext, current[key]);
    }
  }
}
