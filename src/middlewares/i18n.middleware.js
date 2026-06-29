import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "pt-BR",
    preload: ["pt-BR", "en-US", "es-ES"],

    ns: ["common", "validation", "auth", "users", "tickets", "comments", "departments"],
    defaultNS: "common",

    backend: {
      loadPath: path.join(process.cwd(), "src/locales/{{lng}}/{{ns}}.json"),
    },

    detection: {
      order: ["header", "query", "cookie"],
      caches: ["cookie"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export const i18nMiddleware = middleware.handle(i18next);

export default i18next;