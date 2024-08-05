# svs

outils pour scrapper scholarvox

## Procédure

- remplis `vars.json` avec les champs `pscope`, `username`, `password`
- trouver l'url d'un livre, elle se termine par `.../reader/docid/...`
- lancer `svs.js` via `node` pour collecter les pages, l'usage y est décrit :
  - `url` : l'url ci-dessus
  - `output_path` : le dossier où les pages seront sauvegardées
  - `selector_to_hide` : sélecteur css vers les élément qu'on souhaiterais cacher dans les pages
  - `pages_delay` : délai entre la collecte de deux pages
  - `first_page_delay` : délai avant la collecte de la première page
- lancer `pdfunite page*.pdf nom_de_fichier.pdf` dans le dossier où sont sauvegardées les pages
- lancer `crop.py` via `python` pour découper les pages, l'usage y est décrit :
  - `pdf_file` : chemin vers le pdf multipages
  - `width_mm` : largeur en mm souhaitée pour la page (souvent proche du format A4, en tout cas pour les Dunod)
  - `width_mm` : hauteur en mm souhaitée pour la page (souvent proche du format A4, en tout cas pour les Dunod)
- avec `evince`, imprimer dans un pdf le fichier obtenu en cochant `Choisir la taille du papier en fonction de celle des pages du document`