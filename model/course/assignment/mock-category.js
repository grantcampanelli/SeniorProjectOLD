var pathSeparator = "#";

module.exports = function generateMockCategory(name, parentPath) {
    var path = parentPath + pathSeparator + name;

    var result = new Object();
    
    result.name = name
    result.weight = 1
    result.assignments = new Array()
    result.path = path
    
    return result;
    
}