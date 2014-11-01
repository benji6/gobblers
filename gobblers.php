<!DOCTYPE html>
<html>
	<head>
		<?php include '../includes/head_template.php' ?>
	</head>
	<body>
		<?php include '../includes/header_template.php' ?>
		<h2>Gobblers Evolution Simulator</h2>
		<h3>About</h3>
		<p>
			Below is an evolution simulator.
			The canvas is populated with objects called gobblers.
			Gobblers require energy to survive and can get energy by photosynthesizing or eating other gobblers.
			The environment has a light level and oxygen and carbon dioxide levels.
			The gobblers have a number of parameters which influence their behaviour and which can mutate with each successive generation.
		</p>
		<h3>Key</h3>
		<p>The environment light level is visualized by the background color of the canvas.</p>
		<p>The more red a gobbler is the more it leans towards attacking.</p>
		<p>The more blue a gobbler is the more it leans towards defence.</p>
		<p>The more green a gobbler is the more it leans towards photosynthesizing.</p>
		<div id="controller"></div>
		<table id="analysis">
			<thead>
				<tr>
					<th>High-Level Analysis</th>
					<th>Output</th>
					<th>Gobbler Analysis</th>
					<th>Output</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Light Level</td>
					<td><output id="lightLevel"></output></td>
					<td>Average Energy</td>
					<td><output id="energyPerGobbler"></output></td>
				</tr>
				<tr>
					<td>Oxygen Level</td>
					<td><output id="oxygenLevel"></output></td>
					<td>Average Velocity Coefficient</td>
					<td><output id="averageVelocityCoefficient"></output></td>
				</tr>
				<tr>
					<td>Carbon Dioxide Level</td>
					<td><output id="carbonDioxideLevel"></output></td>
					<td>Average Attack Coefficient</td>
					<td><output id="averageAttackCoefficient"></output></td>
				<tr>
					<td>Total Energy</td>
					<td><output id="totalEnergy"></output></td>
					<td>Average Defence Coefficient</td>
					<td><output id="averageDefenceCoefficient"></output></td>
				</tr>
				<tr>
					<td>Number of Gobblers</td>
					<td><output id="intGobblers"></output></td>
					<td>Average Photosynthesis Coefficient</td>
					<td><output id="averagePhotosynthesisCoefficient"></output></td>
				</tr>
				<tr>
					<td>Number of Eatings</td>
					<td><output id="eatCount"></output></td>
				</tr>
				<tr>
					<td>Reproduction Count</td>
					<td><output id="reproductionCount"></output></td>
				</tr>
				<tr>
					<td>Death Count</td>
					<td><output id="deathCount"></output></td>
				</tr>
				<tr>
					<td>Youngest Generation</td>
					<td><output id="intYoungestGen"></output></td>
				</tr>
				<tr>
					<td>Oldest Generation</td>
					<td><output id="intOldestGen"></output></td>
				</tr>
			</tbody>
		</table>
		<script src="gobblers.js"></script>
		<?php include '../includes/template_scripts.php' ?>
		<script>shifterOn = false; //deactivate shifter from template script to free up resources</script>
	</body>
</html>