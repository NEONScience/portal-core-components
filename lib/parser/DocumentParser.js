"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeUtil = require("../util/typeUtil");
var DocumentParser = {
  parseQuickStartGuideVersionResponse: function parseQuickStartGuideVersionResponse(response) {
    if (!(0, _typeUtil.exists)(response)) {
      return null;
    }
    var data = (0, _typeUtil.resolveAny)(response, 'data');
    if (!(0, _typeUtil.exists)(data)) {
      return null;
    }
    return {
      name: data.name,
      version: data.version,
      publishedDate: data.publishedDate,
      documents: DocumentParser.parseQuickStartGuideDocuments(data.documents)
    };
  },
  parseQuickStartGuideDocuments: function parseQuickStartGuideDocuments(documents) {
    if (!Array.isArray(documents)) {
      return [];
    }
    return documents.map(function (document) {
      return DocumentParser.parseQuickStartGuideDocument(document);
    });
  },
  parseQuickStartGuideDocument: function parseQuickStartGuideDocument(document) {
    return {
      name: document.name,
      description: document.description,
      type: document.type,
      size: document.size,
      md5: document.md5,
      generationDate: document.generationDate,
      url: document.url
    };
  }
};
Object.freeze(DocumentParser);
var _default = DocumentParser;
exports.default = _default;