function transformText(replacementMap, targetString) {
    for (const key in replacementMap) {
        const regex = new RegExp('{{' + key + '}}', 'g');
        const replacement = replacementMap[key];
        targetString = targetString.replace(regex, replacement);
    }
    return targetString;
}

module.exports = {transformText};