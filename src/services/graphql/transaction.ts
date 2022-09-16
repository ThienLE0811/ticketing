import { gql, QueryOptions } from "@apollo/client";
import moment from "moment";
import graphql from "@/services/graphql";
import { message } from "antd";

type getAllDocTransactionReq = {
    transactionId: string;
    fromDate?: string;
    toDate?: string;
}
export async function getAllDocTransaction(data: getAllDocTransactionReq, option?: Omit<QueryOptions, 'query'>): Promise<any> {

    const GET_ALL_DOC_TRANSACTION = gql`
        query {
            graphql( 
                header: {
                api: "graphql", 
                apiKey: "MS13276ZIDA4TFGSWYSB2Cl89VARNAAH",
                userID: "0019788803",
                location: "10.9.12.90"
            }
            body: {
                enquiry: {
                authenType: "getAllDocTransaction"
                transactionId: "${data.transactionId}",
                fromDate:  "${data.fromDate || moment().format('YYYYMMDD')}",
                toDate:  "${data.toDate || moment().format('YYYYMMDD')}",
            }
                }
                ) {
                    error {
                            code
                            desc
                            }
                    body {
                            status
                            __typename
                            enquiry {
                            error_msg
                            lcc
                            customerName
                            fm
                            customerAccount
                            ft
                            amount
                            ftRelated
                            channel
                            bank
                            trace
                            lccGbc
                            transDate
                            typeTransaction
                            }
                }
        }}`


    return await graphql.client.query({ query: GET_ALL_DOC_TRANSACTION, ...option })



}