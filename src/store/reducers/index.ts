import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { createSelector } from 'reselect';

import * as fromMovie from './movie';
import * as fromUi from './ui';
import * as fromCinema from './cinema';
import * as fromBooking from './booking';

export interface State {
    movie: fromMovie.State,
    ui: fromUi.State,
    cinema: fromCinema.State,
    booking: fromBooking.State,
};

export const initialState: State = {
    movie: fromMovie.initialState,
    ui: fromUi.initialState,
    cinema: fromCinema.initialState,
    booking: fromBooking.initialState,
};

const reducers = {
    movie: fromMovie.reducer,
    ui: fromUi.reducer,
    cinema: fromCinema.reducer,
    booking: fromBooking.reducer,
};

const devReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const prodReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: State, action: any) {
    const production = false;

    if (production)
        return prodReducer(state, action);
    else
        return devReducer(state, action);
}

// movie state

const getMovieState = (state: State) => state.movie;

export const getMovieEntities = createSelector(getMovieState, fromMovie.getEntities);
export const getMovieIds = createSelector(getMovieState, fromMovie.getIds);
export const getMovieLoading = createSelector(getMovieState, fromMovie.getLoading);

export const getMovieCurrent = createSelector(getMovieState, fromMovie.getCurrent);
export const getMovieFuture = createSelector(getMovieState, fromMovie.getFuture);

export const getMovieSelectedId = createSelector(getMovieState, fromMovie.getSelectedId);
export const getMovieSelected = createSelector(getMovieState, fromMovie.getSelected);

// ui state

const getUiState = (state: State) => state.ui;

export const getUiRootTabIndex = createSelector(getUiState, fromUi.getRootTabIndex);

// cinema state
export const getCinemaState = (state: State) => state.cinema;

const getCinemas = createSelector(getCinemaState, fromCinema.getCinemas);
export const getCinemaCurrentId = createSelector(getCinemaState, fromCinema.getCurrentCinemaId);
export const getCinemaCurrent = createSelector(getCinemaState, fromCinema.getCurrentCinema);
export const getCinemaCurrentShowtimes = createSelector(getCinemaState, fromCinema.getCurrentShowtimes);
export const getCinemaShowtimesLoading = createSelector(getCinemaState, fromCinema.getShowtimesLoading);

// booking state
const getBookingState = (state: State) => state.booking;

export const getBookingAvailableShowtimes = createSelector(getMovieSelectedId, getCinemaCurrentShowtimes, (movieId, showtimes) => {
    return showtimes.filter(s => s.movieId == movieId);
});

const getBookingShowtimeId = createSelector(getBookingState, fromBooking.getShowtimeId);
export const getBookingShowtime = createSelector(getBookingAvailableShowtimes, getBookingShowtimeId, (showtimes, showtimeId) => {
    return showtimes.find(s => s.id == showtimeId);
});

export const getBookingHallLoading = createSelector(getBookingState, fromBooking.getHallLoading);
export const getBookingHall = createSelector(getBookingState, fromBooking.getHall);

export const getBookingSeats = createSelector(getBookingState, fromBooking.getSeats);

const getBookingShowtimeCinema = createSelector(getCinemas, getBookingShowtime, (cinemas, showtime) => {
    if (showtime == null)
        return null;
        
    return cinemas[showtime.cinemaId];
});
const getBookingShowtimeMovie = createSelector(getMovieEntities, getBookingShowtime, (movies, showtime) => {
    if (showtime == null)
        return null;

    return movies[showtime.movieId];
})
export const getBookingOrder = createSelector(getBookingShowtimeCinema, getBookingHall, getBookingShowtimeMovie, getBookingShowtime, getBookingSeats, (cinema, hall, movie, showtime, seats) => {
    if (showtime == null)
        return null;

    return {
        cinema: cinema,
        hall: hall,
        movie: movie,
        showtime: showtime,
        seats: seats,
    };
})