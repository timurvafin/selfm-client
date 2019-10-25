import React, { Component } from 'react';
import { Line } from '@vx/shape';
import { Point } from '@vx/point';
import { GlyphDot } from '@vx/glyph';
import { LinearGradient } from '@vx/gradient';

import './project.scss';


class ProjectVis extends Component {
  render() {
    
    const opts = {
      width : '100%',
      height: 480,
      margin: {
        top   : 10,
        left  : 30,
        right : 40,
        bottom: 80,
      }
    };
    
    return (
      <svg
        width={opts.width}
        height={opts.height}>
        <LinearGradient
          id="lg"
          from="#fd9b93"
          to="#fe6e9e"
        />
        
        <rect
          width={opts.width}
          height={opts.height}
          rx={14}
          fill="transparent"
        />
        
        <Line
          from={new Point({ x: '20%', y: 25 })}
          to={new Point({ x: '20%', y: opts.height - 25 })}
          stroke=""
          strokeWidth="5px"
        />
        
        <GlyphDot
          className={"glyph-dots"}
          key={'line-dot-{i}'}
          cx={50}
          cy={100}
          r={30}
          fill={"url('#lg')"}
          stroke={"#272b4d"}
          strokeWidth={3}>
          
          <text
            x={50}
            y={100}
            dx={-25}
            dy={4}
            stroke={"black"}
            strokeWidth={1}
            fontSize={11}>
            {"Start!"}
          </text>
        </GlyphDot>
      </svg>
    );
  }
}

export default ProjectVis;