import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LanguagetransComponent } from './languagetrans/languagetrans.component';

export const routes: Routes = [
    {
        path : '',
        component: LanguagetransComponent
    },


    {
        path : 'languagetrans',
        component: LanguagetransComponent
    }
];
