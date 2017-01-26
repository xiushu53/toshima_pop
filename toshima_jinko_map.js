// function

//Drawing the piechat
function drawPie(data, choName) {
	var pieData = [];
	for (i in data) {
		if (data[i]['町丁目'] === choName) {
			pieData.push(data[i].rate_male, data[i].rate_female);
			var g = svg.selectAll(".arc")
				.data(pie(pieData))
    			.enter().append("g")
      			.attr("class", "arc")
				.attr('transform', 'translate(500, ' + (height/8 + margin.top)*1.1 + ')');

			g.append("path")
    			.attr("d", arc)
    			.style("fill", function(d) { return color(d.data); });

			g.append("text")
    			.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    			.attr("dy", ".35em")
				.attr('dx', '-1em')
    			.text(function(d) { return Math.round(d.data) + '%'; })
    			.style('fill', 'white');
		};
	};
};


//Drawing the barchat
function drawBar(data, choName) {
	var barData = [];

	for (i in data) {
		if (data[i]['町丁目'] === choName) {
			var data17 = {'name': '<18'},
				data18 = {'name': '18-39'},
				data40 = {'name': '40-64'},
				data65 = {'name': '65<='};

			data17['pop'] = data[i].u18_m + data[i].u18_f;
			data18['pop'] = data[i].a1839_m + data[i].a1839_f;
			data40['pop'] = data[i].a4064_m + data[i].a4064_f;
			data65['pop'] = data[i].o65_m + data[i].o65_f;

			barData.push(data17, data18, data40, data65);

			var barHeight = 20;

			x_bar.domain([0, 3300]);

			svg.selectAll('.bar')
				.data(barData)
				.enter().append('rect')
				.attr('class', 'bar')
				.attr('transform', 'translate(0, 400)')
				.attr('x', 0)
				.attr('width', function(d) {
					return x_bar(d.pop)
				})
				.attr('y', function(d, i) {
					return i*30;
				})
				.attr('height', barHeight)
				.style('fill', 'steelblue')
		};
	};

	svg.append('g')
		.selectAll('.bar')
		.data(barData)
		.enter()
		.append('text')
		.attr('id', 'bar_text')
		.attr('transform', 'translate(0, 415)')
		.attr('x', function(d) {
			return x_bar(d.pop);
		})
		.attr('dx', '.35em')
		.attr('y', function(d, i) {
			return i*30;
		})
		.text(function(d) {
			return d.pop;
		})
		.style('font-size', '9pt')
		.style('fill', 'black');

};


// change event

// map mouseover
function map_change(choName) {
	d3.selectAll('#' + choName)
		.style('stroke', 'yellow')
		.style('stroke-width', '4px')
		.style('opacity', .5);
};

function map_recover(choName) {
	d3.selectAll('#' + choName)
		.style('stroke', 'grey')
		.style('stroke-width', '.25px')
		.style('opacity', 1);
};

// scatter mouseover
function scatter_change(choName) {
	d3.selectAll('#s_' + choName)
        .attr('r', 6)
		.style('fill', 'red');
};

function scatter_recover(choName) {
	d3.selectAll('#s_' + choName)
		.attr('r', 3.5)
		.style('fill', 'steelblue');
};



// Define the svg and others

// svg margin and size 
var margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 60
};

var width = 1200 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;

// Define the scatter plot
var x = d3.scaleLinear().range([0, width - 800]);
var y = d3.scaleLinear().range([height - 200, 0]);


// Definie the pie chart
var radius = 80;

var color = d3.scaleOrdinal()
    .range(["#3182bd", "#e6550d"]);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });


// barchart
var x_bar = d3.scaleLinear().range([0, 450]);


//map
var color_map = d3.scaleLinear()
		.range(['#fafafa', 'steelblue']);


// Append the svg
var svg = d3.select('body').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// tooltips
var div = d3.select('body').append('div')
			.attr('class', 'tooltip')
			.style('opacity', '0')




// Reading the data

d3.csv('toshima_jinko_rate.csv', function(error, data) {
    d3.json('toshima4326.json', function(error, json) {
		if (error) throw console.log(error);

		data.forEach(function(d) {
			d.cho = d['町丁目'];
			d.u18_m = +d['18歳未満_男'];
			d.u18_f = +d['18歳未満_女'];
			d.a1839_m = +d['18～39歳_男'];
			d.a1839_f = +d['18～39歳_女'];		
			d.a4064_m = +d['40～64歳_男'];		
			d.a4064_f = +d['40～64歳_女'];		
			d.o65_m = +d['65歳以上_男'];		
			d.o65_f = +d['65歳以上_女'];
			d.rate_old = +d['高齢化率'];
			d.rate_young = +d['若者率'];
			d.tot = d.u18_m + d.u18_f + d.a1839_m + d.a1839_f 
					+ d.a4064_m + d.a4064_f + d.o65_m + d.o65_f;
			d.rate_male = ((d.u18_m + d.a1839_m + d.a4064_m + d.o65_m) /
							d.tot) * 100;
			d.rate_female = ((d.u18_f + d.a1839_f + d.a4064_f + d.o65_f) /
							d.tot) * 100;
		});


		// barchat
		
		// Add the barchat label
		var barName = [
			{'name': '18歳未満'},
			{'name': '18-39歳'},
			{'name': '40-64歳'},
			{'name': '65歳以上'}
			];
		
		svg.selectAll('text')
			.data(barName)
			.enter().append('text')
			.attr('transform', 'translate(-5, 415)')
			.attr('x', 0)
			.attr('y', function(d, i) {
				return 30*i; 
			})
			.attr('text-anchor', 'end')
			.attr('font-size', '12px')
			.text(function(d) {
				return d.name;
			});
		
		// Add the barchart Xaxis
		svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x_bar))
			.attr('id', 'bar_axis');



		// Scatter plot

		// グラフ内クリックで表示データを切り替え
		svg.selectAll('rect')
			.data([1])
			.enter().append('rect')
			.attr('width', width - 800)
			.attr('height', height - 200)
			.style('fill', '#FFF')
			.on('click', function(d) {
				var at = d3.selectAll('circle')
							.attr('cy');

				if (at == 81.12661374947402) {
					d3.selectAll('circle')
						.transition().duration(800)
						.attr('cy', function(d) {
						return y(d.rate_old);
					});

					d3.selectAll('#Ylabel')
						.text('高齢化率');

				} else {
					d3.selectAll('circle')
						.transition().duration(800)
						.attr('cy', function(d) {
						return y(d.rate_young);
					});

					d3.selectAll('#Ylabel')
						.text('若者率');
				}
			});



		// Axis domain scatter plot 
    	x.domain([0, d3.max(data, function(d) {
			return d.tot;
		})]);
		y.domain([d3.min(data, function(d) {
			return Math.min(d.rate_young, d.rate_old);
		}), d3.max(data, function(d) {
			return Math.max(d.rate_young, d.rate_old);
		})]);


		// Drawing the scatter plot
		svg.selectAll("dot")
			.data(data)
			.enter().append('circle')
				.attr('id', function(d) {
					return 's_' + d.cho;
				})
				.attr('cx', function(d) {
					return x(d.tot);
				})
				.attr('cy', function(d) {
					return y(d.rate_young);
				})
				.attr('r', 3.5)
				.style('fill', 'steelblue')
				.on("mouseover", function(d) {
					d3.select(this)
						.transition().duration(100)
						scatter_change(d.cho);
					drawPie(data, d.cho);
					drawBar(data, d.cho);
					map_change(d.cho);

				// Display the tooltips
				    div.transition().duration(300)
					    .style('opacity', .6);
				    div.html(d.cho 
                    + '<br>総人口:' + Math.round(d.tot) + '人'
                    + '<br>若者率:' + Math.round(d.rate_young*100) + '%')
                    	.style('left', (d3.event.pageX) + "px")
						.style('top', (d3.event.pageY) + 'px');
				})
				.on('mouseout', function(d) {
					d3.select(this)
						.transition().delay(50).duration(100)
						scatter_recover(d.cho);
					d3.selectAll('.arc').remove();
					d3.selectAll('.bar').remove();
					d3.selectAll('#bar_text').remove();
					map_recover(d.cho);

					div.transition().duration(300)
						.style('opacity', 0);
				});

    
		svg.append('g')
			.attr('transform', 'translate(0,' + (height - 200) + ')') // 軸の位置
			.call(d3.axisBottom(x)
					.ticks(10)
					); // 目盛りの位置
		
		svg.append('g')
			.call(d3.axisLeft(y));
		
		// label for X axis
		svg.append('text')
			.attr('x', (width - 800) / 2)
			.attr('y', height -200 + margin.bottom*0.7)
			.style('text-anchor', 'middle')
			.text('町丁目別総人口');

		// label for Y axis
		svg.append('text')
			.attr('id', 'Ylabel')
			.attr('transform', 'rotate(-90)')
			.attr('x', 0 - (height / 2 - 100))
			.attr('y', 0 - margin.left)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('若者率');
		
		svg.append('text')
			.attr('x', 500)
			.attr('y', margin.top / 2)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.text('男女比');
		



		// map

		var jmax = d3.max(data, function(d) {
			return d.tot;
		});
		var jmin = d3.min(data, function(d) {
			return d.tot;
		});

		s = color_map.domain([jmin, jmax]);


		var projection = d3.geoMercator()
				.scale(600000)
				.center(d3.geoCentroid(json))
				.translate([700, height* 3/5 + 10]);

		var path = d3.geoPath().projection(projection);
		
		svg.selectAll('path')
			.data(json.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('id', function(d) {
				return d.properties.MOJI;
			})
			.style('stroke', '#AAA')
			.style('stroke-width', '.25px')
			.style("fill", function(d) {
				var pop = [];
				for (i in data) {
					if (data[i]['町丁目'] === d.properties.MOJI) {
						pop.push(data[i].tot); 
						return color_map(pop);
				}
			}})
			.on('mouseover', function(d) {
				d3.select(this)
				.transition().duration(100)
					map_change(d.properties.MOJI);
				scatter_change(d.properties.MOJI);
				drawPie(data, d.properties.MOJI);
				drawBar(data, d.properties.MOJI);

				div.transition().duration(300)
					.style('opacity', .6);
				div.html(d.properties.MOJI + '<br>' + Math.round(d.properties.JINKO) + '人')
					.style('left', (width * .7) + 'px')
					.style('top', (height / 10) + 'px');
						
			})
			.on('mouseout', function(d) {
				d3.select(this)
				.transition().duration(100)
					map_recover(d.properties.MOJI);
				scatter_recover(d.properties.MOJI);
				d3.selectAll('.arc').remove();
				d3.selectAll('.bar').remove();
				d3.selectAll('#bar_text').remove();
			})

		svg.selectAll(".place-label")
			.data(json.features)
			.enter()
			.append("text")
			.attr("font-size", "8px")
			.attr("class", "place-label")
			.attr("transform", function(d) {
				var lat = d.properties.Y_CODE;
				var lng = d.properties.X_CODE;
				return "translate(" + projection([lng, lat]) + ")";
			})
			.attr("dx", "-1.5em")
			.text(function(d) { return d.properties.MOJI; });
		
		// Add legend

		var legendView = svg.append("g")
	  		.attr("class", "legendQuant")
	  		.attr("transform", "translate(950,480)");	
		
		var legend = d3.legendColor()
			.cells(5)	//表示するセルの数を指定
			.title('町丁目別総人口')
			.shapeWidth(30) //各セルの横幅を指定する
			.scale(s); //凡例のスケールを指定		
			
			//凡例を描画する
			legendView.call(legend);	



	});
});