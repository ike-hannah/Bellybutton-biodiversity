function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
  // 2. Use d3.json to load and retrieve the samples.json file 
  var samples = data.samples;
    // Filter the data for the object with the desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var subjects = data.metadata.filter((val) => val.id == sample);
    var result = resultArray[0];
    subjects = subjects[0]
    var wfreq = Object.values(subjects)[6];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = result.otu_ids;
    var otuLab = result.otu_labels;
    var sampVal = result.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0,10).map(otuIDs => `OTU ${otuIDs}`).reverse();
    console.log(yticks)
    

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sampVal.slice(0, 10).reverse(),
        text: otuLab.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    
    };
    //10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    


// 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otuID,
      y: sampVal,
      text: otuLab,
      mode: "markers",
      marker: {
        size: sampVal,
        color: otuID,
        colorscale: "Earth"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      hovemode: "closest",
      xaxis: { title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

     // 4. Create the trace for the gauge chart.
     
     var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "#000082" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lightgreen"},
            { range: [8, 10], color: "green"},
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 325,
      margin: { t: 0, b: 0 } };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}