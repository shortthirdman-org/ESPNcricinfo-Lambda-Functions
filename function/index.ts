import {} from '@aws-sdk/client-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';
import axios from 'axios';
import { Context, Handler, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
const logger = new Logger();

const instance = axios.create({
    baseURL: 'https://hs-consumer-api.espncricinfo.com/v1',
    timeout: 0,
    responseType: 'json',
    headers: {'Origin': 'https://www.espncricinfo.com', 'Referrer': 'https://www.espncricinfo.com', 'Accept': '*/*'}
});

export const handler: Handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    console.log('Remaining time: ', context.getRemainingTimeInMillis());
    console.log('Function name: ', context.functionName);
    let response = null;
    let queryParams = null;
    try {
        switch (event.path) {
            case "/teams":
                queryParams = new URLSearchParams();
                queryParams.append('lang', 'en');
                queryParams.append('featuredVideoGenres', 'false');
                queryParams.append('followItems', 'false');
                queryParams.append('appItems', 'false');
                queryParams.append('siteItems', 'false');
                queryParams.append('featuredItems', 'false');
                queryParams.append('allTeams', 'true');
                response = await instance.get("/global/details", {
                  params: queryParams,
                });
                break;
            case "/team-details":
                queryParams = new URLSearchParams();
                queryParams.append('lang', 'en');
                queryParams.append('teamId', '2');
                response = await instance.get("/pages/team/home", {
                    params: queryParams,
                  });
                break;
            default:
                break;
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data: null,
                requestId: context.awsRequestId
            })
        };
    } catch (err: any) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err?.response?.text,
            })
        };
    }
};