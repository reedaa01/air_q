# Air Quality Data Sources

## Objective

Identify and evaluate reliable air-quality data sources for Moroccan cities.

## Candidate Sources

### WAQI API

- Documentation:
- Authentication:
- Moroccan cities covered:
- Available pollutants:
- Update frequency:
- Usage limits:
- Known limitations:

### OpenAQ API

- Documentation:
- Authentication:
- Moroccan cities covered:
- Available pollutants:
- Update frequency:
- Usage limits:
- Known limitations:

## Evaluation Criteria

- Moroccan city coverage
- Data freshness
- Pollutant availability
- API reliability
- Usage limits
- Licensing
- Response format

## Final Decision

To be completed after testing both APIs.

### Test géographique au Maroc

Une recherche géographique a été effectuée avec l’endpoint
`/map/bounds/` sur une zone couvrant approximativement Rabat et
Casablanca.

Résultat :

json
{
  "status": "ok",
  "data": []
}

### Test OpenAQ au Maroc

Une recherche a été effectuée dans OpenAQ Explorer pour plusieurs villes marocaines, notamment Casablanca, Rabat, Marrakech, Fès, Tanger et Ben Guerir.

La couverture observée reste limitée. Des stations ont été trouvées uniquement à Marrakech et à Ben Guerir.

#### Station Marrakech-Residence Mima

* Ville : Marrakech
* Nom : Marrakech-Residence Mima
* Type : capteur d’air fixe
* Propriétaire : campus
* Fournisseur : AirGradient
* Instrument : Unknown AirGradient Sensor
* Mesures disponibles :

  * PM1
  * PM2.5
  * PM10
  * humidité relative
  * température
  * concentration de particules PM0.3
* Fréquence de mise à jour observée : mise à jour récente, environ une heure
* Données disponibles depuis : 17 mai 2024
* Licence : CC BY 4.0

#### Station UM6P_Bengeurir2

* Ville : Ben Guerir
* Nom : UM6P_Bengeurir2
* Type : capteur d’air fixe
* Propriétaire : campus
* Fournisseur : AirGradient
* Instrument : Unknown AirGradient Sensor
* Mesures disponibles :

  * PM1
  * PM2.5
  * PM10
  * humidité relative
  * température
  * concentration de particules PM0.3
* Fréquence de mise à jour observée : mise à jour récente, environ une heure
* Données disponibles depuis : 23 octobre 2024
* Licence : CC BY 4.0

#### Station ARC Air

* Ville : Ben Guerir
* Nom : ARC Air
* Type : capteur d’air fixe
* Propriétaire : campus
* Fournisseur : AirGradient
* Instrument : AirGradient Open Air Generation 1 (O-1PST)
* Mesures disponibles :

  * PM1
  * PM2.5
  * humidité relative
  * température
  * concentration de particules PM0.3
* Fréquence de mise à jour observée : mise à jour récente, environ une heure
* Données disponibles depuis : 26 mars 2025
* Licence : CC BY 4.0

### Conclusion sur OpenAQ

OpenAQ fournit des données récentes et exploitables pour certaines zones du Maroc. Les stations trouvées utilisent principalement des capteurs AirGradient et mesurent surtout les particules fines.

Cependant, la couverture géographique reste insuffisante pour un projet visant plusieurs grandes villes marocaines. Aucune station n’a été observée à Casablanca, Rabat, Fès ou Tanger.

OpenAQ peut donc être retenue comme source partielle ou secondaire, notamment pour Marrakech et Ben Guerir, mais elle ne peut pas constituer l’unique source de données du projet.
