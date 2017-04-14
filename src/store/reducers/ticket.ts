import { createSelector } from 'reselect';

import * as actionsTicket from './../actions/ticket';
import * as actionsAccount from './../actions/account';
import * as _ from 'lodash';

import { Ticket } from './../models';

import { AsyncOperation, AsyncStatus, defaultAsyncOp, makeAsyncOp } from "./../utils";

export interface State {
    tickets: { [ticketId: string]: Ticket };

    loadingOp: AsyncOperation;

    selectedTicketId: string;
}

export const initialState: State = {
    tickets: {},

    loadingOp: defaultAsyncOp(),

    selectedTicketId: null,
};

export function reducer(state: State = initialState, actionRaw: actionsTicket.Actions | actionsAccount.UpdateSuccessAction | actionsAccount.LogoutSuccessAction) {
    switch (actionRaw.type) {
        case actionsTicket.ActionTypes.LOAD: {
            return {
                ...state,
                loadingOp: makeAsyncOp(AsyncStatus.Pending),
            };
        }
        case actionsTicket.ActionTypes.LOAD_SUCCESS: {
            let action = <actionsTicket.LoadSuccessAction>actionRaw;

            var newTickets = _.keyBy(action.payload, t => t.id);

            return {
                ...state,
                tickets: { ...state.tickets, ...newTickets },
                loadingOp: makeAsyncOp(AsyncStatus.Success),
            };
        }
        case actionsTicket.ActionTypes.LOAD_FAIL: {
            let action = <actionsTicket.LoadFailAction>actionRaw;

            return {
                ...state,
                loadingOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
            };
        }
        case actionsTicket.ActionTypes.SELECT: {
            let action = <actionsTicket.SelectAction>actionRaw;

            return {
                ...state,
                selectedTicketId: action.payload,
            };
        }
        case actionsAccount.ActionTypes.UPDATE_SUCCESS: {
            let action = <actionsAccount.UpdateSuccessAction>actionRaw;
            let tickets = _.keyBy(action.payload.tickets, t => t.id);

            return {
                ...state,
                tickets: tickets,
            };
        }
        case actionsAccount.ActionTypes.LOGOUT_SUCCESS: {
            return {
                ...state,
                tickets: {}
            };
        }
        default: {
            return state;
        }
    }
}

const getTicketsEntities = (state: State) => state.tickets;
export const getTickets = createSelector(getTicketsEntities, (entities) => {
    return _.values(entities);
});

export const getLoadingOp = (state: State) => state.loadingOp;
const getSelectedTicketId = (state: State) => state.selectedTicketId;

export const getSelectedTicket = createSelector(getTicketsEntities, getSelectedTicketId, (entities, selectedId) => {
    return entities[selectedId];
});