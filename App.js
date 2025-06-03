// App.js (à placer DIRECTEMENT à la racine de votre dépôt GitHub)

// Importations nécessaires pour Expo Router
import { ExpoRoot } from "expo-router";
// Si vous utilisez Head de expo-router pour le SEO ou le titre de la page,
// cette ligne peut être nécessaire. Sinon, elle n'est pas obligatoire.
import Head from "expo-router/head"; 

// C'est le composant par défaut que Snack Expo (et Expo lui-même) va chercher.
// Il doit être exporté comme 'default' et être une fonction.
export default function ExpoRouterApp() {
  return (
    // Si vous avez importé Head, enveloppez votre application avec Head.Provider
    // Sinon, retirez Head.Provider et le Head.Provider> de fermeture.
    <Head.Provider>
      {/*
        ExpoRoot est le composant qui initialise votre application Expo Router.
        Le paramètre `context` est CRUCIAL ici.
        Il doit pointer vers votre dossier `app`.
        `require.context("./app", true)` indique à Webpack (utilisé par Expo)
        de chercher des fichiers JavaScript/TypeScript dans le dossier `./app`
        (à la racine du projet) et ses sous-dossiers.
        `location="/" ` définit le chemin initial de votre application, généralement la racine.
      */}
      <ExpoRoot context={require.context("./app", true)} location="/" />
    </Head.Provider>
  );
}