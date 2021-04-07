import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '100vh', 'opacity': '1', 'visibility': 'visible'
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '100vh'
            })),
            animate('800ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]


export const SlideTopAnimation = [
    trigger('slideTop', [
        //transform: 'translateY(100%)'
        state('in', style({
            'transform': 'translateY(0)'
        })),
        state('out', style({
            'transform': 'translateY(100%)'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'transform': 'translateY(100%)'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('400ms ease-in-out', style({
                'transform': 'translateY(0)'
            }))
        ]
        )])
    ]),
]


export const SlideLeft = [
    trigger('slideLeft', [
        state('in', style({
            'width': '100%', 'opacity': '1', 'visibility': 'visible', 'right': '0'
        })),
        state('out', style({
            'width': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'width': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('100ms ease-in', style({
                'right': '0'
            })),
            animate('1ms ease-in', style({
                'visibility': 'visible'
            })),
            animate('600ms ease-in', style({
                'width': '100%'
            })),
            animate('800ms ease-in', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]


export const SlideFromLeftRightAnimation = [
    trigger('slideLeftRightOut', [
        state('left', style({
            'marginLeft': '0'
        })),
        state('right', style({
            'marginLeft': '100%'
        })),
        transition('left => right', [group([
            animate('600ms ease-in-out', style({
                'marginLeft': '100%'
            })),
        ]
        )]),
        transition('right => left', [group([
            animate('600ms ease-in-out', style({
                'marginLeft': '0'
            })),
        ]
        )])
    ]),
]


export const SlideFromLeftToMinus100 = [
    trigger('slideLeftToMinus100', [
        state('minus', style({
            'marginLeft': '-100%'
        })),
        state('left', style({
            'marginLeft': '0'
        })),
        transition('minus => left', [group([
            animate('600ms ease-in-out', style({
                'marginLeft': '0'
            })),
        ]
        )]),
        transition('left => minus', [group([
            animate('600ms ease-in-out', style({
                'marginLeft': '-100%'
            })),
        ]
        )])
    ]),
]
export const inOutAnimation =  [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]

export const slideInAnimation =
    trigger('routeAnimations', [
        //      transition('Home => Post', [
        //           query(':enter, :leave', 
        //                style({ position: 'fixed', width: '100%' }), 
        //                { optional: true }),        
        //           group([
        //                query(':enter',[
        //                    style({ transform: 'translateY(100%)' }),
        //                    animate('0.5s ease-in-out', 
        //                    style({ transform: 'translateY(0%)' }))
        //                ], { optional: true }),

        //           ])
        //      ]),
        //      transition('Post => Home', [
        //         query(':enter, :leave', 
        //              style({ position: 'fixed', width: '100%' }), 
        //              { optional: true }),        
        //         group([
        //              query(':enter',[
        //                  style({ transform: 'translateY(100%)' }),
        //                  animate('0.5s ease-in-out', 
        //                  style({ transform: 'translateY(0%)' }))
        //              ], { optional: true }),
        //              query(':leave', [
        //                  style({ transform:   'translateY(0%)'}),
        //                  animate('0.5s ease-in-out', 
        //                  style({ transform: 'translateY(100%)' }))
        //              ], { optional: true }),
        //         ])
        //    ])
    ]);