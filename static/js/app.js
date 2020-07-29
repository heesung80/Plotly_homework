//select the dropdown value
var selectDropdown = d3.select("#selDataset");
function addOptions() {
    d3.json("samples.json").then(function(data) {
        data.names.forEach((name, i) => {
            var appendOption = selectDropdown.append("option").text(name).attr('value', i);
        });
    });
}
addOptions();
// function for showing data. It will be used for initial function and optionChange function later.
function show_data(value) {
    d3.json("samples.json").then((importedData) => {
       console.log(importedData);

        var data = importedData.samples[value];
        console.log(data);

        var samples =data.sample_values;
        var otu_ids = data.otu_ids;
        // collect top 10 otu ids with samples
        var top10_samples = samples.slice(0,10);
        var top10_otu_ids = otu_ids.slice(0,10);
        top10_otu_ids_str = top10_otu_ids.map(String)
        for (i = 0; i < 10; i++)
            top10_otu_ids_str[i] = "OTU " + top10_otu_ids_str[i]
        console.log(top10_samples);
        console.log(top10_otu_ids_str);
        //display metadata key values.
        var input_data = importedData.metadata[value];
        var meta  =  d3.select("#sample-metadata");
        meta.html("");
        meta.append("li").text( `ID: ${input_data.id}`);
        meta.append("li").text( `Ethnicity: ${input_data.ethnicity}`);
        meta.append("li").text( `Gender: ${input_data.gender}`);
        meta.append("li").text( `Age: ${input_data.age}`);
        meta.append("li").text( `Location: ${input_data.location}`);
        meta.append("li").text( `BBType: ${input_data.bbtype}`);
        meta.append("li").text( `wfreq: ${input_data.wfreq}`);

        // bar chart
        var trace1 ={
        x: top10_samples,
        y: top10_otu_ids_str,
        text: top10_otu_ids_str,
        type:"bar",
        orientation: "h",
            transforms: [{
              type: 'sort',
              target: 'y',
              order: 'descending'
            }]
        };
            
        var plot_data = [trace1];
        
        Plotly.newPlot("bar", plot_data);

        //bubble chart
        var trace2 = {
            x: otu_ids,
            y: samples,
            mode: 'markers',
            marker :{
                color: otu_ids,
                size : samples
            }
        };
        var bubble_data =[trace2];
        Plotly.newPlot('bubble',bubble_data)
        //gauge chart
        var wfreq = input_data.wfreq
        var gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency <br> Scrubs per Week"},
                type: "indicator",
                mode: "gauge+number",
                gauge: { 
                    axis: { range: [null, 9] } ,
                    steps: [
                        { range: [0, 1], color: "#ebeedc" },
                        { range: [1, 2], color: "#d7ebb9"},
                        { range: [2, 3], color: "#b6dfa8" },
                        { range: [3, 4], color:  "#a1db9a" },
                        { range: [4, 5], color: "#8dd59f" },
                        { range: [5, 6], color:  "#7ecdae" },
                        { range: [6, 7], color:  "#62c19a" },
                        { range: [7, 8], color:  "#3dbd88" },
                        { range: [8, 9], color:  "#25a16e" },
                    ]}
            }
        ];
        
        var gauge_layout = { 
            width: 600, height: 500, margin: { t: 0, b: 0 },
         };
        Plotly.newPlot('gauge', gauge_data, gauge_layout);

        
    });
};

// showing initial data
function init(){
    show_data(0);
}

//showing selected data
d3.selectAll("#selDataset").on("change",optionChanged);

function optionChanged(){
    var dropdownMenu = d3.select("#selDataset");
    var ds_index = dropdownMenu.property("value");
    console.log(ds_index);
        show_data(ds_index);
 
};

// after refreshing the website, initial data will be shown. 
init();
