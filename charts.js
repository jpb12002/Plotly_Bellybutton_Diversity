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
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = sampleArray.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleData = sampleNumber[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuIds = sampleData.otu_ids;
    var sampleOtuLabels = sampleData.otu_labels;
    var sampleValues = sampleData.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var otuIdsValues = {};
      sampleOtuIds.map((i, j) => otuIdsValues[i] = sampleValues[j]);

    var values = Object.entries(otuIdsValues).sort((a, b) => b[1] - a[1]).map(i => i[1]).slice(0,10).reverse();
    var ids = Object.entries(otuIdsValues).sort((a, b) => b[1] - a[1]).map(i => i[0]).slice(0,10).reverse();

    var yticks = ids.map(id => "OTU " + id.toString());

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: sampleOtuLabels,
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found", 
      xaxis: {title:"Bacteria Population"},
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

// 1. Create the trace for the bubble chart.
var bubbleData = [{
  x: sampleOtuIds,
  y: sampleValues,
  text: sampleOtuLabels,
  mode: "markers",
  marker: {size: sampleValues, color: sampleOtuIds, colorscale: "Earth"}
}
];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: "Bacteria Cultures Per Sample",
  xaxis: {title: "OTU ID"},
  yaxis: {title: "Bacteria Population"},
  paper_bgcolor: "rgba(0,0,0,0)",
  height: 600,
  width: 1150
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout)

// 1. Create a variable that filters the metadata array for the object with the desired sample number.
var metadataArrayFilter = data.metadata.filter(sampleObject => sampleObject.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataArraySample = metadataArrayFilter[0];

    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = metadataArraySample.wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      title: {text:"Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0, 10], tickwidth: 2, tickcolor: "darkblue"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "green"}
        ]}
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: {text: "Belly Button Washing Frequency"},
      width: 500,
      height: 500,
      paper_bgcolor: "rgba(0,0,0,0)" 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}