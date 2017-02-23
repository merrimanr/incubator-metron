import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Alert} from '../model/alert';

@Injectable()
export class AlertService {

    public getAll(): Observable<Alert[]> {
        return Observable.create(observer => {
            observer.next(Alert.getData());
            observer.complete();
        });
    }
}