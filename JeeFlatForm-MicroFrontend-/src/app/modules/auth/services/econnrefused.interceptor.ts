import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, throwError, of } from 'rxjs';
import { retryWhen, tap, mergeMap, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    retryDelay = 1000;
    retryMaxAttempts = 5000;
    private alertShown = false;
    constructor(private snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                this.retryAfterDelay(),
                finalize(() => {
                    if (this.alertShown) {
                        // this.snackBar.open('Connected to the server successfully.', '', { duration: 5000 });
                        this.alertShown = false;
                    }
                })
            );
    }

    retryAfterDelay(): any {
        return retryWhen(errors => {
            return errors.pipe(
                mergeMap((err: HttpErrorResponse, count: number) => {
                    // Check if the error was ECONNREFUSED or 504
                    if (err.error.message == undefined || err.message.includes('took too long to respond') || err.status === 504) {
                        return of(err).pipe(
                            tap(error => {
                                if (!this.alertShown) {
                                    // this.snackBar.open(`Cannot connect to the server. Retrying...`);
                                    this.alertShown = true;
                                }
                            }),
                            mergeMap(() => timer(this.retryDelay))
                        );
                    } else {
                        // If the error is not ECONNREFUSED or 504, rethrow it
                        return throwError(err);
                    }
                })
            );
        });
    }
}