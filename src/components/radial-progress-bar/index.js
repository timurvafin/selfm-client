import React from 'react'
import cs from 'classnames'
import './radial-progress-bar.scss'
import { Motion, spring } from 'react-motion'

class Sector extends React.Component {
    getDelta(diff) {
        return Math.max(5, Math.floor(diff / 18))
    }

    getDimensions(r, center, angle, y0) {
        // Arc angles
        const firstAngle  = angle > 180 ? 90 : angle - 90
        const secondAngle = -270 + angle - 180

        // Arcs
        const firstArc  = this.getArc(r, center, firstAngle)
        const secondArc = angle > 180 ? this.getArc(r, center, secondAngle) : ''

        const start = `M${center},${center} L${center}, ${y0}`
        const end   = 'z'

        return `${start} ${firstArc} ${secondArc} ${end}`
    }

    getArc(r, center, angle) {
        const x = center + r * Math.cos(this.radians(angle))
        const y = center + r * Math.sin(this.radians(angle))

        return `A${r},${r} 1 0 1 ${x},${y}`
    }

    radians(degrees) {
        return degrees / 180 * Math.PI
    }

    render() {
        const {radius, center, y0, color, angle, className} = this.props
        const d = this.getDimensions(radius, center, angle, y0)

        return <path className={className} fill={color} d={d} />
    }
}

class RadialProgressBar extends React.Component {
    renderSector(center, radius, angle, y0, color) {
        return (
            <Sector
                className="rpb__svg__sector"
                radius={radius}
                center={center}
                angle={angle}
                y0={y0}
                color={color}
            />
        )
    }

    render() {
        const {size, className, progress, color} = this.props
        const cls = cs(className, 'radial-progress-bar')

        const parentR          = size / 2
        const center           = parentR
        const outerStrokeWidth = size / 12
        const outerR           = parentR - outerStrokeWidth / 2
        const innerMargin      = 2
        const innerR           = parentR - innerMargin - outerStrokeWidth

        const angle       = progress * 360 / 100
        const y0          = outerStrokeWidth + innerMargin
        const motionStyle = {angle: spring(angle, {stiffness: 260, damping: 26, precision: 5})}


        return <span className={cls} style={{width: size + 'px', height: size + 'px'}}>
            <svg
                className="rpb__svg"
                width={size}
                height={size}
                version="1.1"
                viewBox={`0 0 ${size} ${size}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="rpb__svg__outline"
                    cx={center}
                    cy={center}
                    r={outerR}
                    stroke={color}
                    strokeWidth={outerStrokeWidth}
                />

                <Motion defaultStyle={{angle: 0}} style={motionStyle}>
                    {style => this.renderSector(center, innerR, style.angle, y0, color)}
                </Motion>
            </svg>
        </span>
    }
}

export default RadialProgressBar