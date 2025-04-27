# 📄 Résumeur d'Articles : Outil Automatisé d'Analyse de l'Actualité

---

<div style="page-break-after: always;"></div>

## 👥 Membres de l'Équipe

- Thi Hong Nhung  
- Sayqin Rustamli

---

<div style="page-break-after: always;"></div>

## 1. Présentation du Projet

**🎯 Objectif :**  
Développer une extension Chrome permettant de **trouver**, **résumer** et **analyser le sentiment** des articles d'actualité.

**🧠 Motivation :**  
Face à la masse d'actualités publiées chaque jour, il est difficile d'en extraire rapidement l'essentiel.  
Notre outil aide les utilisateurs à :

- Retrouver plusieurs points de vue journalistiques,
- Comprendre rapidement les articles par des résumés concis,
- Identifier l'opinion globale grâce à l'analyse du sentiment.

---

<div style="page-break-after: always;"></div>

## 2. Données & Sources

**📚 Type de Données :**
- Contenus d'articles extraits en temps réel.

**📰 Sources Utilisées :**
- Le Monde (actualités françaises)
- Le Figaro (actualités françaises)

**🔎 Pourquoi ces sources ?**
- Fiabilité journalistique reconnue.
- Diversité des opinions.
- Focus francophone pour démonstration.

---

<div style="page-break-after: always;"></div>

## 3. Aperçu Général

Cette extension Chrome permet de :

- Résumer automatiquement des articles provenant de **lemonde.fr** et **lefigaro.fr**,
- Analyser le **sentiment** global de l’article (positif, négatif ou neutre),
- Suggérer des **articles connexes** pertinents,
- Utiliser **l’API OpenAI** pour le traitement linguistique.

---

<div style="page-break-after: always;"></div>

## 4. Architecture Technique

| Composant | Rôle |
|:---|:---|
| Frontend (Extension Chrome) | Interface utilisateur (popup) et interactions |
| Script de Contenu (`content.js`) | Extraction de l'article depuis la page web |
| Backend (Flask) | Traitement du résumé et analyse de sentiment |
| Intégration OpenAI | Intelligence artificielle pour résumé et sentiment |

---

<div style="page-break-after: always;"></div>

# 5. Composants en Détail

---

<div style="page-break-after: always;"></div>

## 5.1 `manifest.json` - Configuration de l'Extension

```json
{
    "manifest_version": 3,
    "name": "Article Summarizer",
    "version": "1.0",
    "description": "Extension pour résumer et analyser des articles français.",
    "permissions": ["activeTab", "scripting", "storage"],
    "host_permissions": ["*://*.lemonde.fr/*", "*://*.lefigaro.fr/*"],
    "action": {
        "default_popup": "src/popup.html"
    }
}
```

**📌 Objectif :**  
Définir les autorisations nécessaires et pointer vers le fichier principal d'interface (`popup.html`).

---

<div style="page-break-after: always;"></div>

## 5.2 `content.js` - Extraction du Contenu Web

```javascript
function extractArticleContent() {
    const possibleContentSelectors = [
        "article", ".article-content", ".article-body", ".entry-content",
        ".story-body", ".post-content", "#article-body", ".content-article",
        ".article__content", ".fig-content"
    ];
    // Extraction dynamique de l'article principal
}
```

**📌 Fonctionnalités :**
- Détection automatique du contenu principal via des sélecteurs CSS.
- Sélection de l'élément ayant le plus grand volume de texte.
- Fallback : Agrégation de paragraphes si besoin.

---

<div style="page-break-after: always;"></div>

## 5.3 Interface Utilisateur (`popup.html` / `popup.js`)

```html
<div id="results">
    <h3>Résumé</h3>
    <div id="summary"></div>
    <h3>Sentiment</h3>
    <div id="sentiment" class="neutral"></div>
    <h3>Articles Connexes</h3>
    <div id="related-news"></div>
</div>
```

**📌 Fonctionnement :**
- L’utilisateur clique sur "Résumer l’article".
- `popup.js` :
  - Montre un indicateur de chargement.
  - Demande à `content.js` d'extraire le contenu.
  - Envoie le texte au serveur Flask (`/summarize`).
  - Affiche Résumé, Sentiment et Actualités Connexes.

**📌 Gestion des erreurs :**
- Messages explicites pour les échecs réseau, API ou CORS.

---

<div style="page-break-after: always;"></div>

## 5.4 `app.py` - Backend Flask & Traitement IA

```python
@app.route('/summarize', methods=['POST'])
def summarize_article():
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Assistant spécialisé en résumés d'articles d'actualité."},
            {"role": "user", "content": f"Titre: {title}\n\nContenu: {truncated_content}\n\n1. Résumez.\n2. Analysez le sentiment."}
        ]
    )
    # Analyse de la réponse et retour JSON
```

**📌 Fonctionnalités :**
- Communication avec OpenAI.
- Extraction de résumé concis et de sentiment.
- Retour au frontend sous forme JSON.

---

<div style="page-break-after: always;"></div>

## 5.5 `requirements.txt` - Dépendances

```bash
flask==2.2.3
flask-cors
openai>=1.0.0
beautifulsoup4==4.11.2
requests
python-dotenv
```

**📌 Utilisation :**
- Serveur Web : Flask
- Scraping HTML : BeautifulSoup
- Appel API : OpenAI
- Variables d'environnement : dotenv

---

<div style="page-break-after: always;"></div>

# 6. Flux Global des Données

```plaintext
Utilisateur ➔ Extension Chrome (popup.html)
    ⇩
popup.js ➔ envoie une demande ➔ content.js
    ⇩
content.js ➔ extrait le texte de l'article ➔ renvoie à popup.js
    ⇩
popup.js ➔ envoie texte ➔ Flask (route /summarize)
    ⇩
Flask ➔ transmet à OpenAI ➔ Résumé + Sentiment
    ⇩
Retour vers popup.js ➔ Affichage Résumé & Sentiment
    ⇩
popup.js ➔ envoie titre ➔ Flask (route /related-news)
    ⇩
Flask ➔ Scraping de Le Monde / Le Figaro ➔ Retours d'articles
    ⇩
popup.js ➔ Affiche les articles connexes
```

---

<div style="page-break-after: always;"></div>

# 7. Solutions Techniques Distinctives

| Solution | Description |
|:---|:---|
| Multisource Actualités | Prise en charge simultanée de plusieurs sites |
| Résilience du Scraping | Utilisation de multiples sélecteurs CSS |
| Analyse Sentiment Optimisée | Normalisation en trois catégories (positif, neutre, négatif) |
| Recherche en Temps Réel | Scraping immédiat de résultats d'actualités |

---

<div style="page-break-after: always;"></div>

# 8. Installation et Lancement

## 1. Charger l'extension Chrome

```bash
chrome://extensions ➔ "Charger l’extension non empaquetée" ➔ sélectionner le dossier
```

## 2. Démarrer le backend Flask

```bash
pip install -r requirements.txt
export OPENAI_API_KEY="votre_cle_api"
python app.py
```

## 3. Utiliser l'extension

- Naviguer sur **lemonde.fr** ou **lefigaro.fr**.
- Cliquer sur l’icône d’extension.
- Résumer l'article et consulter les résultats.

---

<div style="page-break-after: always;"></div>

# 📢 Remarques Finales

- Architecture propre, modulaire, professionnelle.
- Adaptable à d'autres sources francophones.
- Extension idéale pour les utilisateurs francophones souhaitant synthétiser rapidement l’actualité.

---

# ✅ Document prêt pour rapport, présentation ou soutenance !


