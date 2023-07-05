function(instance, properties, context) {
    
    // Bail on missing
    if (properties.printablecontent == null) {
        instance.triggerEvent("actionfailed");
        return;
    }
    
    // Ingest
    const options = {
        printable: properties.printablecontent,
        onPdfOpen: () => { instance.triggerEvent("pdfopened"); },
        onLoadingStart: () => { instance.triggerEvent("printstarted"); },
        onLoadingEnd: () => { instance.triggerEvent("printcompleted"); },
        onPrintDialogClose: () => { instance.triggerEvent("printexited"); },
        onIncompatibleBrowser: () => { instance.triggerEvent("actionfailed"); },
        onError: (e, x) => { instance.triggerEvent("actionfailed"); }
    };
    const maptypes = {
        "PDF URL": "pdf",
        "PDF Base64": "pdf",
        "HTML Element": "html",
        "Image": "image",
        "Serialized JSON": "json",
        "Raw HTML": "raw-html"
    };
    if (properties.contenttype) { options.type = maptypes[properties.contenttype]; }
    if (properties.contenttype == "PDF Base64") { options.base64 = true; }
    if (properties.header) { options.header = properties.header; }
    if (properties.headerstyle) { options.headerStyle = properties.headerstyle; }
    if (properties.width != null) { options.maxWidth = properties.width; }
    if (properties.cssurls && properties.cssurls.length()) {
    	options.css = properties.cssurls.get(0, properties.cssurls.length());
    }
    if (properties.style) { options.style = properties.style; }
    if (properties.processstyles != null) { options.scanStyles = properties.processstyles; }
    if (properties.specificstyles && properties.specificstyles.length()) {
    	options.targetStyle = properties.specificstyles.get(0, properties.specificstyles.length());
    }
    if (properties.styleranges && properties.styleranges.length()) {
    	options.targetStyles = properties.styleranges.get(0, properties.styleranges.length());
    }
    if (properties.ignoreelements && properties.ignoreelements.length()) {
    	options.ignoreElements = properties.ignoreelements.get(0, properties.ignoreelements.length());
    }
    if (properties.jsonproperties && properties.jsonproperties.length()) {
    	options.properties = properties.jsonproperties.get(0, properties.jsonproperties.length());
    }
    if (properties.tableheaderstyle) { options.gridHeaderStyle = properties.tableheaderstyle; }
    if (properties.tablestyle) { options.gridStyle = properties.tablestyle; }
    if (properties.repeattableheader != null) { options.repeatTableHeader = properties.repeattableheader; }
    if (properties.message) {
        options.showModal = true;
        options.modalMessage = properties.message;
    }
    if (properties.title) { options.documentTitle = properties.title; } 
    if (properties.fallbackpdf) { options.fallbackPrintable = properties.fallbackpdf; }
    
    // Digest
    printJS(options);
}