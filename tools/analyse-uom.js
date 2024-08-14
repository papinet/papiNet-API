const fs = require('fs');
const YAML = require('yaml');

const file = fs.readFileSync('../3.0.0/papiNet-API.yaml', 'utf8');

const doc = YAML.parse(file);

function dumpKeys(context, current) {
  for (key in current) {
    if (current[key].type == 'object' || current[key].type == 'array') {

      if (current[key].type == 'object') {
        if (key != 'items') {
          newContext = context + "." + key;
        }
      }
      if (current[key].type == 'array') {
        newContext = context + "." + key + "[]";
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

dumpKeys('', doc.components.schemas);

