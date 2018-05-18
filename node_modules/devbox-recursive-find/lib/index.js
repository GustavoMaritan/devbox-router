//ts-check

const fs = require('fs'),
    path = require('path');
    
require('devbox-linq');

module.exports = {
    file: fileTreeView,
    dir: dirTreeView
}

/**
 * 
 * @description Busca todos arquivos dentro de um caminho especifico
 * 
 * @param {String?} root Caminho base onde sera localizados os arquivos.
 * @param {Array?} filters Nomes a serem buscados dentro do caminho especificado
 * @param {Boolean?} recursive Buscar arquivos em pastas internas da base passada default=true
 * 
 * @example find.file('./src',['.js']);
 * 
 * @returns {Array} 
 * 
 */
function fileTreeView(root, filters, recursive) {
    let foldersReport = [];
    recursive = typeof recursive == 'boolean' ? recursive : true;
    filters = Array.isArray(filters) ? filters : [filters];

    fs.readdirSync(root).forEach(function (fileName) {
        let fullPath = path.join(root, fileName);
        if (recursive && fs.lstatSync(fullPath).isDirectory())
            foldersReport = foldersReport.concat(fileTreeView(fullPath, filters, recursive));
        else if (filters.any(x => fullPath.includes(x)))
            foldersReport.push(fullPath);
    });
    return foldersReport;
}


/**
 * 
 * @description Busca todos arquivos dentro de um caminho especifico
 * 
 * @param {String} root Caminho base onde sera localizados os diretórios.
 * @param {Array} filters Nomes a serem buscados dentro do caminho especificado
 * @param {Boolean?} recursive Buscar diretórios em pastas internas da base passada | default=true
 * 
 * @example find.dir('./src',['helpers'], false);
 * 
 */
function dirTreeView(root, filters, recursive) {
    let foldersReport = [];
    recursive = typeof recursive == 'boolean' ? recursive : true;
    filters = Array.isArray(filters) ? filters : [filters];

    fs.readdirSync(root).forEach(function (fileName) {
        let fullPath = path.join(root, fileName);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (filters.any(x => fullPath.includes(x)))
                foldersReport.push(fullPath);
            if (recursive)
                foldersReport = foldersReport.concat(dirTreeView(fullPath, filters, recursive));
        }
    });
    return foldersReport;
}