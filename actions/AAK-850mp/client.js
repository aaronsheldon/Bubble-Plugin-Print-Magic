async function(properties, context) {
    
    // Load and clean
    const copies = Math.max(1, properties.copies || 1);
    const margin = Math.max(0, properties.pagemargin || 0);
    const width = Math.max(0, (properties.pagewidth || 0) - (2 * margin));
    const height = Math.max(0, (properties.pageheight || 0) - (2 * margin));
    const translate = Math.abs((width - height) / 2);
    const portrait = properties.pageorientation == "portrait";
    const orientated = properties.pageorientation != null;
    const dimensioned = properties.pagewidth != null && properties.pageheight != null;
    const selectors = properties.styleselectors == null ?
    	[] :
    	properties.styleselectors.get(0, properties.styleselectors.length());
    const pages = properties.htmlpages == null ?
    	[] :
    	properties.htmlpages.get(0, properties.htmlpages.length());
    
    // Default do nothing
    let exteriorwidth = "";
    let exteriorheight = "";
    let interiortop = "";
    let interiorleft = "";
    let interiorwidth = "";
    let interiorheight = "";
    let interiortransform = "";
    let orientationmagic = "";
    
    // Default no-op
    if (!dimensioned && !orientated) {}
    
    // Portrait with no dimensions
    else if (!dimensioned && portrait) {
        exteriorwidth = "          width: 100vw;\n";
        exteriorheight = "          height: 100vh;\n";
        orientationmagic = "        @media (orientation: portrait) {\n" +
            "          div.orientationinterior {\n" +
            "            width: 100vw;\n" +
            "            height: 100vh;\n" +
            "          }\n" +
            "        }\n" +
            "        @media (orientation: landscape) {\n" +
            "          div.orientationinterior {\n" +
            "            top: calc((100vh - 100vw) / 2);\n" +
            "            left: calc((100vw - 100vh) / 2);\n" +
            "            width: 100vh;\n" +
            "            height: 100vw;\n" +
            "            transform: rotate(90deg);\n" +
            "          }\n" +
            "        }\n";
    }
    
    // Landscape with no dimensions
    else if (!dimensioned) {
        exteriorwidth = "          width: 100vw;\n";
        exteriorheight = "          height: 100vh;\n";
        orientationmagic = "        @media (orientation: portrait) {\n" +
            "          div.orientationinterior {\n" +
            "            top: calc((100vh - 100vw) / 2);\n" +
            "            left: calc((100vw - 100vh) / 2);\n" +
            "            width: 100vh;\n" +
            "            height: 100vw;\n" +
            "            transform: rotate(90deg);\n" +
            "          }\n" +
            "        }\n" +
            "        @media (orientation: landscape) {\n" +
            "          div.orientationinterior {\n" +
            "            width: 100vw;\n" +
            "            height: 100vh;\n" +
            "          }\n" +
            "        }\n";
    }
    
    // Both dimensions, no orientation
    else if (dimensioned && !orientated) {
        exteriorwidth = "          width: " + width.toString() + "mm;\n";
        exteriorheight = "          height: " + height.toString() + "mm;\n";
        interiorwidth = "          width: " + width.toString() + "mm;\n";
        interiorheight = "          height: " + height.toString() + "mm;\n";
    }
    
    // Portrait height greater than width
    else if (dimensioned && portrait && width <= height) {
        exteriorwidth = "          width: " + width.toString() + "mm;\n";
        exteriorheight = "          height: " + height.toString() + "mm;\n";
        interiorwidth = "          width: " + width.toString() + "mm;\n";
        interiorheight = "          height: " + height.toString() + "mm;\n";
    }
    
    // Portrait otherwise
    else if (dimensioned && portrait) {
        exteriorwidth = "          width: " + width.toString() + "mm;\n";
        exteriorheight = "          height: " + height.toString() + "mm;\n";
        interiortop = "          top: -" + translate.toString() + "mm;\n";
        interiorleft = "          left: " + translate.toString() + "mm;\n";
        interiorwidth = "          width: " + height.toString() + "mm;\n";
        interiorheight = "          height: " + width.toString() + "mm;\n";
        interiortransform = "          transform: rotate(90deg);\n";
    }
    
    // Landscape width greater than height
    else if (dimensioned && height <= width) {
        exteriorwidth = "          width: " + width.toString() + "mm;\n";
        exteriorheight = "          height: " + height.toString() + "mm;\n";
        interiorwidth = "          width: " + width.toString() + "mm;\n";
        interiorheight = "          height: " + height.toString() + "mm;\n";
    }
    
    // Landscape otherwise
    else if (dimensioned) {
        exteriorwidth = "          width: " + width.toString() + "mm;\n";
        exteriorheight = "          height: " + height.toString() + "mm;\n";
        interiortop = "          top: " + translate.toString() + "mm;\n";
        interiorleft = "          left: -" + translate.toString() + "mm;\n";
        interiorwidth = "          width: " + height.toString() + "mm;\n";
        interiorheight = "          height: " + width.toString() + "mm;\n";
        interiortransform = "          transform: rotate(90deg);\n";
    }
    
    // Add style
    const printstyles = context
    .jQuery("<style></style>")
    .html(

        // Screen query
        "      @media screen {\n" +

        // Hide pages on screen
        "        body > div.printpages, body > div.printpages * {\n" +
        "          width: 0 !important;\n" +
        "          height: 0 !important;\n" +
        "          margin: 0 !important;\n" +
        "          padding: 0 !important;\n" +
        "          border: 0 !important;\n" +
        "          outline: 0 !important;\n" +
        "          display: none !important;\n" +
        "          box-shadow: none !important;\n" +
        "          visibility: collapse !important;\n" +
        "          overflow: clip !important;\n" +
        "        }\n" +
        "      }\n" +

        // Print query
        "      @media print {\n" +

        // Request physical margin
        "        @page {\n" +
        "          margin: " + margin.toString() + "mm;\n" +
        "        }\n" +

        // Hide app on print
        "        body > *:not(div.printpages), body > *:not(div.printpages) * {\n" +
        "          width: 0 !important;\n" +
        "          height: 0 !important;\n" +
        "          margin: 0 !important;\n" +
        "          padding: 0 !important;\n" +
        "          border: 0 !important;\n" +
        "          outline: 0 !important;\n" +
        "          display: none !important;\n" +
        "          box-shadow: none !important;\n" +
        "          visibility: collapse !important;\n" +
        "          overflow: clip !important;\n" +
        "        }\n" +

        // Default to tight fit on printed pages
        "        html, body, div.printpages {\n" +
        "          margin: 0;\n" +
        "          padding: 0;\n" +
        "          border: 0;\n" +
        "          outline: 0;\n" +
        "          box-shadow: none;\n" +
        "          display: table;\n" +
        "        }\n" +

        // Define a single page
        "        div.printpage {\n" +
        "          margin: 0;\n" +
        "          padding: 0;\n" +
        "          border: 0;\n" +
        "          outline: 0;\n" +
        "          box-shadow: none;\n" +
        "          display: block;\n" +
        "          break-inside: avoid;\n" +
        "        }\n" +
        "        div.printpage:not(:last-child) {\n" +
        "          break-after: page;\n" +
        "        }\n" +
        "        div.printpage:not(:first-child) {\n" +
        "          break-before: page;\n" +
        "        }\n" +
        "        div.printpage:last-child {\n" +
        "          break-after: avoid;\n" +
        "        }\n" +
        "        div.printpage:first-child {\n" +
        "          break-before: avoid;\n" +
        "        }\n" +

        // Page orientation
        "        div.orientationexterior {\n" +
        exteriorwidth +
        exteriorheight +
        "          margin: 0;\n" +
        "          padding: 0;\n" +
        "          border: 0;\n" +
        "          outline: 0;\n" +
        "          box-shadow: none;\n" +
        "          display: block;\n" +
        "          position: relative;\n" +
        "          overflow: clip;\n" +
        "        }\n" +
        "        div.orientationinterior {\n" +
        interiortop +
        interiorleft +
        interiorwidth +
        interiorheight +
        interiortransform +
        "          margin: 0;\n" +
        "          padding: 0;\n" +
        "          border: 0;\n" +
        "          outline: 0;\n" +
        "          box-shadow: none;\n" +
        "          display: block;\n" +
        "          position: relative;\n" +
        "          overflow: clip;\n" +
        "        }\n" +
        orientationmagic +

        // Remove floats at start and end of page
        "        div.clearheader, div.clearfooter {\n" +
        "          width: 0;\n" +
        "          height: 0;\n" +
        "          margin: 0;\n" +
        "          padding: 0;\n" +
        "          border: 0;\n" +
        "          outline: 0;\n" +
        "          box-shadow: none;\n" +
        "          display: none;\n" +
        "          overflow: clip;\n" +
        "          clear: both;\n" +
        "        }\n" +

        // Add custom styles
        selectors.reduce((l, r) => l + r + "\n", "") +
        "      }\n"
    )
    .appendTo("head");
    
    // Add pages
    const printpages = context.jQuery("<div></div>")
    .addClass("printpages")
	.html(
    	pages
        .reduce(
        	(l, r) => l + 
            	'      <div class="printpage">\n' +
                '        <div class="clearheader"></div>\n' +
                '        <div class="orientationexterior">\n' +
                '          <div class="orientationinterior">\n' +
            	r + "\n" +
            	"          </div>\n" +
            	"        </div>\n" +
                '        <div class="clearfooter"></div>\n' +
            	"      </div>\n",
            ""
        )
        .repeat(copies)
    )
    .prependTo("body");
    
    // Go
    setTimeout(() => window.print());

    // Clean up
    setTimeout(() => printpages.remove());
    setTimeout(() => printstyles.remove());
    
    // Clean up debug
    // setTimeout(
    //     () => context
    //     .jQuery(window)
    //     .one(
    //         "click", 
    //         () => {
    //             printpages.remove();
    //             printstyles.remove();
    //         }
    //  	)
    // );
}