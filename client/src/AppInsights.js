import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'InstrumentationKey={YOUR_KEY};IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/',
        enableAutoRouteTracking: true,
        extensions: [reactPlugin]
    }
});

appInsights.loadAppInsights();

export { reactPlugin, appInsights };