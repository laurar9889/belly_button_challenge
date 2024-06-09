// Build a constant for each time I need to call the URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const obj in result) {
      panel.append("h6").text(`${obj}`);

    }});
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
  var samples = data.samples;
  // Filter the samples for the object with the desired sample number
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  // Get the otu_ids, otu_labels, and sample_values
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;
 

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    // Render the Bubble Chart
  const bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    margin: {t: 40, l: 180},
    hovermode: "closest",
    xaxis: {title: "OTU ID"}
  };
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const yticks = otu_ids.slice(0,10).map(otuID => 'OTU ${otuID}').reverse();
    const barData = [{
      y:yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    // Render the Bar Chart
const barLayout = {
  title: "Top 10 Bacteria Cultures Found",
  margin: {t: 40, l: 180}
};
Plot.newplot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  // Get the names field

    // Use d3 to select the dropdown with id of `#selDataset`
    const selections = d3.select("#selDataSet");
   
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    // Get the first sample from the list
  d3.json(url).then((data) => {
    const sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selections
              .append("option")
              .text(sample)
              .property("value", sample);
      });
    // Build charts and metadata panel with the first sample
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
