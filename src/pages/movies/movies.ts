﻿import { Component, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { App, ViewController, NavController, Content } from 'ionic-angular';

import { MovieService } from './../../core/movie.service';
import { Movie, MovieScreening } from './../../core/movie.model';

import { MoviePage } from './../movie/movie';

import * as _ from 'lodash';
import moment from 'moment';

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
})
export class MoviesPage implements OnChanges {

    public filter: string;

    public current: Movie[];
    public future: Movie[];

    public loading: boolean;

    @ViewChild(Content) content: Content;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private movieService: MovieService) {

        this.filter = "today";
        this.loading = true;
    }

    ionViewDidEnter() {
        this.content.scrollToTop(0);
        this.movieService.getMovies().subscribe(movies => {
            this.current = movies.filter(m => m.soon == false);
            this.future = movies.filter(m => m.soon == true);

            // fix to show items left aligned
            if (this.future.length % 3 == 1) {
                this.future.push(<any>{});
                this.future.push(<any>{});
            } else if (this.future.length % 3 == 2) {
                this.future.push(<any>{});
            }

            this.content.scrollToTop(0);
            this.loading = false;
        });
    }

    ionViewDidLeave() {
        this.loading = true;
    }

    onFilterChange() {
        this.content.scrollToTop(0);
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    uniqueTimes(screening: MovieScreening[]): any[] {

        if (screening == null || screening.length == 0)
            return [];

        var now = moment();
        var times = _.chain(screening)
            .map(s => {
                var time = moment(s.time);
                return {
                    time: time.format("HH:mm"),
                    active: time.isSame(now, 'day') && time.isAfter(now)
                }
            })
            .uniqBy(t => t.time)
            .value();

        return times;
    }

    uniqueTech(screening: MovieScreening[]): any[] {

        if (screening == null || screening.length == 0)
            return [];

        return _.chain(screening).map(s => s.tech).uniq().value();
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    openMovie(movie: Movie) {
        this.appCtrl.getRootNav().push(MoviePage, {
            movie: movie
        });
    }

}