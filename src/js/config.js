//this is the configuration file for datasources
//contains subqueries for the datasources
//TODO: find out the structure of these queries with rein
//TODO: change structure of values

const config =
{
     'prefixes' : 'PREFIX dc:<http://purl.org/dc/elements/1.1/> \
          PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
          PREFIX foaf-metamatter:<http://xmlns.com/foaf/> \
          PREFIX prov:<http://purl.org/net/provenance/ns#> \
          PREFIX dcterms:<http://purl.org/dc/terms/> \
          PREFIX ogcgs:<http://www.opengis.net/ont/geosparql#> \
          PREFIX nco:<http://www.semanticdesktop.org/ontologies/2007/03/22/nco#>',

     'construct' : 'CONSTRUCT {?entity rdfs:label ?title; dc:isPartOf ?collection; ?imageproperty ?image; ?wktproperty ?wkt}',

     'datasources' : 
          {'http://data.metamatter.nl/molens': 
               //molens
               {
					//change uri to graph
                    'name' : 'Nationaal Molen Bestand', 
                    'enabled' : true,
					'icon': 'molen',
                    'sparql' : 'SELECT * WHERE { GRAPH ?collection { ?entity a <http://purl.org/dc/dcmitype/Image>; rdfs:label ?title; ?imageproperty ?image; ?wktproperty ?wkt . } \
                              FILTER (?imageproperty = foaf-metamatter:depiction) \
                              FILTER (?wktproperty = ogcgs:asWKT)}'
               },
               //beeldbank zeeland
               'http://datalab.bibliotheek.nl/bbz': {
                    'name' : 'Beeldbank Zeeland', 
                    'enabled' : false,
					'icon': 'bbz',
                    'sparql' : 'SELECT DISTINCT * WHERE { GRAPH ?collection { ?entity rdfs:label ?title; ?imageproperty ?image; dcterms:coverage ?coverage . ?coverage ogcgs:hasGeometry ?geometry . ?geometry ?wktproperty ?wkt . \
                         FILTER (?imageproperty = foaf:depiction) . \
                         FILTER (?wktproperty = ogcgs:asWKT) . }}'
               } 
          }
}
