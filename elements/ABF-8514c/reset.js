function(instance, context) {

	// Reset data
    delete instance.data.response;
    delete instance.data.type;

    // Reset state
    instance.publishState("downloadtotal", null);
    instance.publishState("downloadsofar", null);
    instance.publishState("downloadurl", null);
}