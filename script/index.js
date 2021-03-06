$(document).ready(function(){
	
	let width = window.innerWidth,
		height = window.innerHeight;
	
	var year=1965;
	
    // Responsive svg
    let svg = d3.select("body").select("div.main").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox","0 0 " + Math.min(width,height) + " " + Math.min(width,height))
      .attr("preserveAspectRatio","xMinYMin");

    let intro_txt = svg.append("foreignObject")
        .attr("x", width*0.02)
        .attr("y", height*0.02)
        .attr("width", width*0.30)
        .attr("height", height*0.8)
        .append("xhtml:body")
            .style("font-size", "14px")
            .style("margin", "0px")
            .style("padding", "0px 25px 0px 25px")
            .style("color", "#cccccc")
            .style("overflow-y", "scroll")
            .style("background-color", "#333333")
            .html("<h3 style='font-weight: 300'>Global Warming Visualized Through Temperature, Energy Consumption, and Carbon Emissions</h3>"
                + "<h5 style='color: #00aaaa'>by Aditi Mallavarapu, Aryadip Sarkar, and Hai Tran</h5>"
                + "<p style='text-align: justify'>"
                + "<font color='#dddd00'>(Click anywhere on this panel to open this in a new tab)</font><br/><br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;In this project, we attempt to raise people's awareness on "
                + "the issue of global warming by visualizing the world's temperature "
                + "along with the amount of energy consumption and carbon dioxide emissions "
                + "that each country has used or produced each year from 1965 to 2012. "
                + "We provide 3 visualizations, which are linked on top of this page: <br/><br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;1. A world map, the one that you are "
                + "currently seeing, gives you an overview of how the world is "
                + "changing year by year. For example, a big part of Europe became "
                + "much warmer in 1995 compared to 1965. You can select an indicator "
                + "and a year at the bottom of this page to see the changes. "
                + "Hovering your mouse over a country on the map will give you "
                + "more specific information about that country.<br/><br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;2. You can find detailed data of each "
                + "country in our second visualization. After typing a country name "
                + "in the search box and click the search button, three pie charts "
                + "will be displayed. Each chart provides a 50-year view on one "
                + "aspect of the selected country -- Temperature, Energy Consumption, "
                + "or Carbon Emission. In one chart, each arc represents a year, "
                + "and each layer represents a decade. By layering the decades, "
                + "we can immediately see the change of a country 10 years after. "
                + "For example, China has been successfully brought its average "
                + "temperature down during 2001 - 2011. However, they are doing "
                + "poorly in controlling their energy consumption and carbon emission. "
                + "These two indicators are reaching their peaks in the few recent years.<br/><br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;3. Our last visualization is an "
                + "interactive board which shows the top ten countries that "
                + "consumed the most energy or emitted the most carbon dioxide "
                + "each year. When we choose an indicator and select a year, "
                + "the top 10 will be updated. Accordingly, sky color and "
                + "sea level will change to give a sense of global warming. <br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;With this visualization, we attempt to suggest some "
                + "potential factors that may invoke audience's further thoughts: "
                + "could global warming possibly affect sea level and air quality? "
                + "Which countries are using too much energy or producing too "
                + "much pollution? If they could control such factors, would "
                + "the world's average temperature go down? <br/><br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;Hopefully our work will be able to help "
                + "people see the danger of global warming and the threats "
                + "caused by energy consumption and carbon dioxide emissions. "
                + "The responsibility belongs to every one of us."
                + "</p>"
            )
            .on("click",function(d){
                window.open(
                  'intro.html',
                  '_blank' // <- This is what makes it open in a new window.
                );
            });

	  
	var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);  
	  
	function getyear(d)
    {
       return d.year;
    }

    function gettemperature(d)
    {
        return d.temperature;
    }  
	
	function render(year,item){
	    if(item=="Temperature(degree Celcius)")
		{
			rendertemperature(year);	//temperature
		}
		else if(item=="Energy Consumption(Kg of Oil Equivalent per capita)")
		{
			renderenergy(year);	//energy
		}
		else if(item=="Carbon Emissions (Metric Tons per Capita)")
		{
			rendercarbon(year);	//carbon
		}
		else{
			rendertemperature(year);
		}
		
	}
	
	render(1965,"temperature");
	
	function rendertemperature(year){
	 
	 var mineobj = new Array();
     var mineTemp = new Array();		
	 d3.json("./data/tempbycountry.json", function(error,datao) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {
			//push duration for each data point to be converted into scale
            for (var i = 0; i < datao.length; i++) {
				if(year == datao[i].Year)
				{
					mineTemp.push(parseFloat(datao[i].Temperature));
					mineobj.push(datao[i]);
				}
			}
			
            //to control the length of the bars
            var mintemp = d3.min(mineTemp);
           
            var maxtemp = d3.max(mineTemp);
			
            
            var colorScale = d3.scaleQuantize()
                    .domain([mintemp,maxtemp])
                    .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);


      var projection = d3.geoMercator();

	     
      var path = d3.geoPath()
					.projection(projection);

	let canvas_width = width*0.625,
        canvas_height = height*0.65;

      var canvas = svg.append("g")
				.attr("id","remodel")
				.attr("width", width)
				.attr("height", height)
				.attr("transform","translate("+ (width - canvas_width) +","+ (height - canvas_height) +")");
				
	    var group = canvas.append("g")
					.attr("id","remodel")
				   .attr("width", canvas_width)
                   .attr("height", canvas_height);
                   // Why waste more space?
                   //.attr("transform", "translate("+width*0.1+","+height*0.2+")");	

	var colorScale1 = d3.scaleQuantize()
                             .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);
								 
                        var defs = group.append("defs");
                        var linearGradient = defs.append("linearGradient")
                                .attr("id", "linear-gradient");
                        linearGradient
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

                        group.append("rect")
                                .attr("x", -height*0.53)
                                .attr("y", 0)
                                .attr("width", width*0.15)
                                .attr("height", height*0.06)
                                .style("fill", "url(#linear-gradient)")
                                .attr("transform", "rotate(-90)");  // rotating counterclockwise makes things move 
                                                                    // upward instead of downward (thus negative x-
                                                                    // value). I recommend to rotate clockwise next time

                        linearGradient.selectAll("stop")
                                .data( colorScale1.range() )
                                .enter().append("stop")
                                .attr("offset", function(d,i) { return i/(colorScale1.range().length-1); })
                                .attr("stop-color", function(d) { return d; });

                        //adding text to legends
                        group.append('text')
                                .attr('x', width*0.017)
                                .attr('y', height*0.51)
                                .text(mintemp.toFixed(2))
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("fill", "#333333")
                                .style("font-size","12px");

                        group.append('text')
                                .attr('x', width*0.016)
                                .attr('y', height*0.28)
                                .text(maxtemp.toFixed(2))
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("fill", "#dddddd")
                                .style("font-size","12px");

                        group.append('text')
                                .attr('x', width*0.016)
                                .attr('y', height*0.55)
                                .text("??C")
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("font-size","12px")
                                .style('fill', '#ffffff');
				    
				
		d3.json("./data/world_countries.json", function(error,json) {
			if(error)
			{
				console.log(error);
			}
			else{
            //Merge the temperature data and country JSON
            //Loop through once for each temperature data value
			
            for (var i = 0; i < mineobj.length; i++) {
                //Grab state name
                var dataCountry = mineobj[i].Country;
				var year_datao = parseInt(mineobj[i].Year);
				if(year_datao == year){				
					//Grab data value, and convert from string to float
					var dataValue = parseFloat(mineobj[i].Temperature);
					//Find the corresponding country inside the country JSON
					for (var j = 0; j < json.features.length; j++) {
						
						var jsonCountry = json.features[j].properties.name;
						if (dataCountry == jsonCountry) {
                        //Copy the data value into the JSON
							json.features[j].properties.value = dataValue;
							json.features[j].properties.year = year_datao;
							break;
						}
						
					}
				}
			}
			
            //Bind data and create one path per GeoJSON feature
            canvas.selectAll("path")
              .data(json.features)
               .enter()
               .append("path")
			   .attr("class","path")
                    .attr("d", path)
                    .style("fill", function(d) {
                        //Get data value
                        var value = d.properties.value;
						if (value) {
                            //If value exists???
                            return colorScale(value);
                        } else {
                            //If value is undefined???
                            return "#ccc";
                        }
                    })
					
					.on("mouseover",function(d){
										d3.select(this.parentNode.appendChild(this)).transition().duration(300);
										funcmouseover(d)})
                    .on("mouseout", funcmouseout);
					
			 function funcmouseover(d)
            {
                var pageX = d3.event.pageX;
                var pageY = d3.event.pageY;
                div.transition()
                        .duration(200)
                        .style("opacity", .9);
                div.html("Year: "+ d.properties.year+"<br>Avg Temp: " +d.properties.value.toFixed(2)+"<br>Country: "+d.properties.name)
						.style("left", width*0.80)
                        .style("top", height*0.08)
                        .style("color", "white");
						
            }

            function funcmouseout(d)
            {
                div.transition()
                        .duration(2)
                        .style("opacity", 0);
            }
		
			}});		
      
     
      }
	  });
	  
	  };
	  
 function renderenergy(year_val){
	 var mineobj = new Array();
     var mineTemp = new Array();		
	 d3.json("./data/energypercountryperyear.json", function(error,datao) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {
			
			//push duration for each data point to be converted into scale
            for (var i = 0; i < datao.length; i++) {
				if(year_val == datao[i].Year)
				{
					//console.log(datao[i].Energy);
					mineTemp.push(parseFloat(datao[i].Energy));
					mineobj.push(datao[i]);
				}
			}
			
            //to control the length of the bars
            var mintemp = d3.min(mineTemp);
			        
            var maxtemp = d3.max(mineTemp);
			           
            var colorScale = d3.scaleQuantize()
                    .domain([mintemp,maxtemp])
                    .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);


      var projection = d3.geoMercator();

	     
      var path = d3.geoPath()
					.projection(projection);
					
      let canvas_width = width*0.625,
        canvas_height = height*0.65;

      var canvas = svg.append("g")
                .attr("id","remodel")
                .attr("width", width)
                .attr("height", height)
                .attr("transform","translate("+ (width - canvas_width) +","+ (height - canvas_height) +")");
                
        var group = canvas.append("g")
				   .attr("id","remodel")
                   .attr("width", canvas_width)
                   .attr("height", canvas_height);
                   //.attr("transform", "translate("+width*0.1+","+height*0.2+")");			
				
	var colorScale1 = d3.scaleQuantize()
                             .range(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);
								 
                        var defs = group.append("defs");
                        var linearGradient = defs.append("linearGradient")
                                .attr("id", "linear-gradient");
                        linearGradient
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

                        group.append("rect")
                                .attr("x", -height*0.53)
                                .attr("y", 0)
                                .attr("width", width*0.15)
                                .attr("height", height*0.06)
                                .style("fill", "url(#linear-gradient)")
                                .attr("transform", "rotate(-90)");

                        linearGradient.selectAll("stop")
                                .data( colorScale1.range() )
                                .enter().append("stop")
                                .attr("offset", function(d,i) { return i/(colorScale1.range().length-1); })
                                .attr("stop-color", function(d) { return d; });

                        //adding text to legends
                        group.append('text')
                                .attr('x', width*0.017)
                                .attr('y', height*0.51)
                                .text(mintemp.toFixed(2))
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("fill", "#333333")
                                .style("font-size","12px");

                        group.append('text')
                                .attr('x', width*0.016)
                                .attr('y', height*0.28)
                                .text((Math.round(maxtemp) / 1000).toFixed(2))
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("fill", "#dddddd")
                                .style("font-size","12px");

                        group.append('text')
                                .attr('x', width*0.016)
                                .attr('y', height*0.55)
                                .text("x 100Kg Oil Equivalent per Capita")
                                .attr("text-anchor", "middle")
                                .attr("alignment-baseline","central")
                                .style("font-size","12px")
                                .style('fill', '#ffffff');

				
				
		d3.json("./data/world_countries.json", function(error,json) {
			if(error)
			{
				console.log(error);
			}
			else{
            //Merge the temperature data and country JSON
            //Loop through once for each temperature data value
			
            for (var i = 0; i < mineobj.length; i++) {
                //Grab state name
                var dataCountry = mineobj[i].Country;
				
				var year_datao = parseInt(mineobj[i].Year);
				
				if(year_datao == year_val){				
					//Grab data value, and convert from string to float
					var dataValue = parseFloat(mineobj[i].Energy);
					console.log(dataCountry+" "+year_datao+" "+dataValue);
					//console.log(dataValue);
					//Find the corresponding country inside the country JSON
					for (var j = 0; j < json.features.length; j++) {
						
						var jsonCountry = json.features[j].properties.name;
						if (dataCountry == jsonCountry) {
                        //Copy the data value into the JSON
							json.features[j].properties.value = dataValue;
							json.features[j].properties.year = year_datao;
							break;
						}
						
					}
				}
			}
			
            //Bind data and create one path per GeoJSON feature
            canvas.selectAll("path")
              .data(json.features)
               .enter()
               .append("path")
			   .attr("class","path")
                    .attr("d", path)
                    .style("fill", function(d) {
                        //Get data value
                        var value = d.properties.value;
						if (value) {
                            //If value exists???
                            return colorScale(value);
                        } else {
                            //If value is undefined???
                            return "#ccc";
                        }
                    })
					
					.on("mouseover",function(d){
							d3.select(this.parentNode.appendChild(this)).transition().duration(300);
							funcmouseover(d)})
                    .on("mouseout", funcmouseout);
					
			 function funcmouseover(d)
            {
                var pageX = d3.event.pageX;
                var pageY = d3.event.pageY;
                div.transition()
                        .duration(200)
                        .style("opacity", .9);
                div.html("Year: "+ d.properties.year+"<br>Energy Consumption: " +parseFloat(d.properties.value)/*.toFixed(2)*/+"<br>Country: "+d.properties.name)
						.style("left", width*0.80)
                        .style("top", height*0.08)
                        .style("color", "white");
						
            }

            function funcmouseout(d)
            {
                div.transition()
                        .duration(2)
                        .style("opacity", 0);
            }
		
			}});		
      
     
      }
	  });
	  
	  };
	  
	function rendercarbon(year_val){
	
	 var mineobj = new Array();
     var mineTemp = new Array();		
	 d3.json("./data/carboncumlativeByYearByCountry.json", function(error,datao) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {
			
			//push duration for each data point to be converted into scale
            for (var i = 0; i < datao.length; i++) {
				if(year_val == datao[i].Year)
				{
					mineTemp.push(parseFloat(datao[i].Carbon));
					mineobj.push(datao[i]);
				}
			}
				
            //to control the length of the bars
            var mintemp = d3.min(mineTemp);
			           
            var maxtemp = d3.max(mineTemp);
			            
            var radius = d3.scaleSqrt()
							.domain([mintemp,maxtemp ])
							.range([0, 30]);


      var projection = d3.geoMercator();

	     
      var path = d3.geoPath()
					.projection(projection);
				
	let canvas_width = width*0.625,
        canvas_height = height*0.65;

      var canvas = svg.append("g")
                .attr("id","remodel")
                .attr("width", width)
                .attr("height", height)
                .attr("transform","translate("+ (width - canvas_width) +","+ (height - canvas_height) +")");
            
				
		d3.json("./data/world_countries.json", function(error,json) {
			if(error)
			{
				console.log(error);
			}
			else{
            //Merge the temperature data and country JSON
            //Loop through once for each temperature data value
			for (var i = 0; i < mineobj.length; i++) {
                //Grab state name
                var dataCountry = mineobj[i].Country;
				var year_datao = parseInt(mineobj[i].Year);
				if(year_datao == year_val){				
					//Grab data value, and convert from string to float
					var dataValue = parseFloat(mineobj[i].Carbon);
					//Find the corresponding country inside the country JSON
					for (var j = 0; j < json.features.length; j++) {
						var jsonCountry = json.features[j].properties.name;
						if (dataCountry == jsonCountry) {
							//Copy the data value into the JSON
							json.features[j].properties.value = dataValue;
							json.features[j].properties.year = year_datao;
							break;
						}
						
					}
				}
			}
			
            //Bind data and create one path per country JSON feature
			
            canvas.selectAll("path")
					.data(json.features)
					.enter()
					.append("path")
					.attr("class","path")
					.attr("d", path)
					.attr("fill","#aad4dd");
					
            canvas.selectAll("path").each(function(d,i) {  var centroid = path.centroid(d);
                             if(d.properties.name== "USA"){
							 var x= centroid[0]+20;
							 var y = centroid[1]+40;
							 centroid =[x,y];
                             json.features[i].properties.centroid = centroid;
                            }
							else if(d.properties.name== "Norway"){
							 var x= centroid[0]+0;
							 var y = centroid[1]+50;
							 centroid =[x,y];
                             json.features[i].properties.centroid = centroid;
                            }
							else{
								json.features[i].properties.centroid = centroid;
							}
                            });			
					
			canvas.append("g")
					  .attr("id","circleadd")
					  .selectAll("circle")
					  .data(json.features
						 .sort(function(a, b) { return b.properties.value - a.properties.value; }))
					  .enter()
						.append("circle")
						.attr("class","carbon")
						.attr("cx", function (d) {
								return d.properties.centroid[0];
								})
                            .attr("cy", function (d) {
                              return d.properties.centroid[1];
                            })
                            .attr("r", function(d){
										if(d.properties.value){
											return radius(d.properties.value);}
										else{
											return 0;
										}	
										})
                            .attr("fill", "#e33434")
							.attr("fill-opacity",0.5)
							.on("mouseover",function(d){
										d3.select(this.parentNode.appendChild(this)).transition().duration(300);
										funcmouseover(d)})
							.on("mouseout", funcmouseout);
					
			 function funcmouseover(d)
            {
                var pageX = d3.event.pageX;
                var pageY = d3.event.pageY;
                div.transition()
                        .duration(200)
                        .style("opacity", .9);
                div.html("Year: "+ d.properties.year+"<br>Carbon Emissions: " +parseFloat(d.properties.value)/*.toFixed(2)*/+"<br>Country: "+d.properties.name)
						.style("left", width*0.80)
                        .style("top", height*0.08)
                        .style("color", "white");
						
            }

            function funcmouseout(d)
            {
                div.transition()
                        .duration(2)
                        .style("opacity", 0);
            }
		
			}});		
      
     
      }
	  });
	  
	  };
	  //code for slider
	  var x = d3.scaleLinear()
				.domain([1965, 2012])
				.range([0, width*0.6])
				.clamp(true);
		
	var slider = svg.append("g")			//appended to svg
				.attr("class", "slider")
				.attr("transform", "translate(" + width*0.40 + "," + height*0.95 + ")");

	slider.append("line")
			.attr("class", "track")
			.attr("x1", x.range()[0])
			.attr("x2", x.range()[1])
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
					.attr("class", "track-inset")
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
					.attr("class", "track-overlay")
				.call(d3.drag()
					.on("start.interrupt", function() { slider.interrupt(); })
					.on("start drag", function() { handle.attr("cx",x(Math.round(x.invert(d3.event.x))));
												   year = Math.round(x.invert(d3.event.x)); 	//= year on the slider
												   d3.select("svg").selectAll("#circleadd").remove();
												   rerender(year); }));			

	slider.insert("g", ".track-overlay")
		.attr("class", "ticks")
		.attr("transform", "translate(0," + 18 + ")")
		.selectAll("text")
		.data(x.ticks())
		.enter().append("text")
		.attr("x", x)
		.attr("text-anchor", "middle")
		.text(function(d) { return d; })
		.attr("fill","white");

	var handle = slider.insert("circle", ".track-overlay")
		.attr("class", "handle")
		.attr("r", 9);
	  
   
    
	

/* Capture user's selection*/
 
  function rerender(x){
		let selectedValue = $("#selectIndicator").find("option:selected").text();
		
		render(x,selectedValue);
	}
	
	$("#selectIndicator").change(function() {
		let selectedValue = $(this).find("option:selected").text();
		d3.select("svg").selectAll("#remodel").remove();
		render(year,selectedValue);
	});

});
