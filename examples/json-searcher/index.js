module.exports = (line, acc) => {
	if (acc[line.properties.STREET]) acc[line.properties.STREET].push(line);
	else acc[line.properties.STREET] = [line];
};
