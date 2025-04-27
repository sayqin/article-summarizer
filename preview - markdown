# Article Summarizer: Automated News Analysis Tool

## 👥 Team Members

Thi Hong Nhung
Sayqin Rustamli

---

## 1. Project Overview

**Goal:**  
Create a tool that automates the process of finding, summarizing, and analyzing the sentiment of news articles related to a given topic.

**Motivation:**  
With the overwhelming amount of news published daily, it is difficult to quickly get a concise, unbiased overview of current events. Our tool helps users:

- Find related news from multiple sources
- Get concise summaries
- Understand the overall sentiment

---

## 2. Data & Sources

**Type of Data:**

- News articles (web scraping)
- Cross-sectional, real-time data

**Sources Used:**

- Google News (aggregator)
- Le Monde (French news)
- Le Figaro (French news)

**Why these sources?**

- Diversity of perspectives
- Reliable, up-to-date information
- French focus for demonstration

---

## Aperçu Général
Cette extension Chrome permet de résumer automatiquement des articles provenant des sites d'actualités françaises (lemonde.fr, lefigaro.fr), d'analyser le sentiment et de suggérer des articles connexes, en utilisant l'API OpenAI. Le système comprend quatre composants principaux :
- **Frontend (Extension)** : Interface utilisateur et gestion des interactions.
- **Script de Contenu** : Extraction du contenu des articles depuis les pages web.
- **Backend (Serveur Flask)** : Traitement principal (résumé, analyse de sentiment).
- **Intégration IA** : Connexion à l'API OpenAI pour l'analyse sémantique.

### 1. `manifest.json` - Configuration de l'Extension
```json
{
    "manifest_version": 3,
    "name": "Article Summarizer",
    "version": "1.0",
    "description": "Résume des articles...",
    "permissions": ["activeTab", "scripting", "storage"],
    "host_permissions": ["*://*.lemonde.fr/*", "*://*.lefigaro.fr/*"],
    "action": {
        "default_popup": "src/popup.html"
    }
}
```

Objectif :

Définir les autorisations et les paramètres de base de l'extension.

Permettre l'accès aux domaines cibles (lemonde.fr, lefigaro.fr).

## 2. `content.js` - Extraction du Contenu

``` javascript
function extractArticleContent() {
    const possibleContentSelectors = [
        "article", 
        ".article-content",
        // Sélecteurs spécifiques pour lemonde.fr/lefigaro.fr
    ];
    // Logique de détection du contenu principal...
}
```
Fonctionnalités :

Utilise 15+ sélecteurs CSS pour identifier le contenu principal.

Priorise les éléments avec le plus de texte (contenu probable).

Méthode de repli : agrégation des paragraphes longs (>100 caractères).

## 3. Interface Utilisateur (popup.html/popup.js)

```html
<!-- Extrait de popup.html -->
<div id="results">
    <h3>Résumé</h3>
    <div id="summary"></div>
    <h3>Sentiment</h3>
    <div id="sentiment" class="neutral"></div>
</div>
```
- Flux d'Exécution :
L'utilisateur clique sur "Résumer l'article".
- Le script popup.js :
    Affiche un loader.
    Appelle content.js pour extraire le contenu.
    Envoie les données au backend via fetch().
    Affiche les résultats (résumé, sentiment, articles connexes).
- Gestion des Erreurs :
    Messages contextuels pour les erreurs CORS/API.
    Journalisation des erreurs dans la console.

## 4. ` app.py ` - Backend et Traitement IA

``` python 
@app.route('/summarize', methods=['POST'])
def summarize_article():
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Assistant de résumé..."},
            {"role": "user", "content": f"Titre: {title}\nContenu: {truncated_content}"}
        ]
    )
    # Extraction du résumé et du sentiment
```
- Fonctionnalités principales :

Réception du contenu depuis l'extension

Appel à l'API OpenAI avec un prompt structuré

Extraction des informations depuis la réponse :

Résumé concis (limité à 150 mots)

Sentiment global (Positif/Négatif/Neutre)

- Optimisations :

Limitation de la longueur du contenu (4000 caractères) pour respecter les limites de tokens

Journalisation détaillée des erreurs

## 5. ` requirements.txt ` - Dépendances Python
``` python
flask==2.2.3
openai>=1.0.0
beautifulsoup4==4.11.2
```
- Objectif :

Définir les dépendances nécessaires au backend

Flask pour le serveur web

BeautifulSoup4 pour le scraping d'articles connexes

### Flux de Données Global

## Image



- Solutions Techniques Remarquables.

1 . Multiplateforme d'actualités :

Prise en charge simultanée de lemonde.fr et lefigaro.fr

Système de sélecteurs CSS redondants pour améliorer la compatibilité

2. Analyse de Sentiment Intelligente :

Normalisation des résultats en trois catégories

Codage couleur pour l'affichage (vert/rouge/gris)

3. Actualités Connexes en Temps Réel :
``` python
 def search_lemonde(query):
    formatted_query = query.replace(" ", "+")
    url = f"https://www.lemonde.fr/recherche/?search_keywords={formatted_query}"
    # Parsing des résultats
```

Scraping direct depuis les moteurs de recherche des sites

Gestion des URL relatives et des paramètres complexes


## Installation et Test

1 . Installation et Test

``` bash
chrome://extensions → Charger l'extension non empaquetée (dossier contenant manifest.json)
```
2. Démarrage du backend :

``` bash
pip install -r requirements.txt
export OPENAI_API_KEY='votre-clé'
python app.py
```
3. Naviguer sur lemonde.fr/lefigaro.fr et utiliser l'extension

Ce document présente une explication structurée en français professionnel,
mettant en avant les aspects techniques tout en restant accessible pour un public spécialisé. 
Il intègre des termes techniques appropriés et décrit clairement les interactions entre les composants du système.
