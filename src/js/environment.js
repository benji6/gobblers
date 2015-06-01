const initialGobblersCount = 256;
const initialGobblerEnergy = 6;

module.exports = {
	initialGobblerEnergy,
	initialGobblersCount,
	light: () => (Math.sin(Date.now() / 10000) + 1) / 2,
	oxygenLevel: initialGobblersCount * initialGobblerEnergy,
	carbonDioxideLevel: initialGobblersCount * initialGobblerEnergy,
	maxEvolutionPoints: 8,
};
