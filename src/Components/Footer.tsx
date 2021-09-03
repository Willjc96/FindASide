import React from 'react';
import {Icon} from 'semantic-ui-react'

export default function Footer() {
    return (
        <div className='footer-container'>
            <div style={{display: 'flex', alignItems: 'center', margin: 'auto'}}>
                <div style={{padding: '10px'}}>
                    <h4>Kieran Cookson: Co-Creator</h4>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <a target='blank' href='https://www.linkedin.com/in/kieran-cookson/'>
                            <Icon size='large' name='linkedin'/>
                        </a>
                        <a target='blank' href='https://kierans-portfolio.netlify.app/'>
                            <Icon size='large' name='folder'/>
                        </a>
                        <a target='blank' href='https://github.com/kieran170'>
                            <Icon size='large' name='github square' />
                        </a>
                    </div>
                </div>
                <div style={{padding: '10px'}}>
                    <h4>Will Cook: Co-Creator</h4>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <a target='blank' href='https://www.linkedin.com/in/william-cook-b2700a1b5/'>
                            <Icon size='large' name='linkedin'/>
                        </a>
                        <a target='blank' href='https://willjc96.github.io/React-Portfolio/'>
                            <Icon size='large' name='folder'/>
                        </a>
                        <a target='blank' href='https://github.com/Willjc96'>
                            <Icon size='large' name='github square' />
                        </a>
                    </div>
                </div>   
            </div>
            <div style={{alignSelf: 'flex-end'}}>
                <h4>FindASide Gaming © 2021</h4>
            </div>
        </div>
    )
}
