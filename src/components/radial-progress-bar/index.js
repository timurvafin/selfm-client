import React from "react"
import cs from "classnames"
import "./radial-progress-bar.scss"

class AnimatedSector extends React.Component {
    constructor(props) {
        super(props)

        this.thetaDelta = 5
        this.state      = {
            angle: props.angle
        }
    }

    componentWillReceiveProps(props) {
        const animate = () => {
            const stop      = Math.abs(this.state.angle - props.angle) < this.thetaDelta
            const direction = this.state.angle <= props.angle ? 1 : -1

            if (!stop) {
                const nextAngle = this.state.angle + this.thetaDelta * direction
                this.setState({angle: nextAngle})
                this.rafId = requestAnimationFrame(animate)
            }
        }

        this.rafId = requestAnimationFrame(animate)
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId)
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
        const {radius, center, y0, color, className} = this.props

        const d = this.getDimensions(radius, center, this.state.angle, y0)

        return <path className={className} fill={color} d={d}/>
    }
}

class RadialProgressBar extends React.Component {
    step(angleOffset, endAngle, time, endTime) {
        const now        = new Date().valueOf()
        const timeOffset = endTime - now

        if (timeOffset <= 0) {
            this.changeAngle(endAngle)
        } else {
            const angle = endAngle - (angleOffset * timeOffset / time)

            this.changeAngle(angle)
            requestAnimationFrame(() => this.step(angleOffset, endAngle, time, endTime))
        }
    }

    animateTo(angle, time = 300) {
        if (angle > 360) {
            angle = angle % 360
        }

        const startTime   = new Date().valueOf()
        const endTime     = startTime + time
        const angleOffset = angle - this.options.angle

        requestAnimationFrame(() => this.step(angleOffset, angle, time, endTime))
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

        const angle = progress * 360 / 100
        //const d = this.getSectorDimensions(innerR, center, progress * 360 / 100, outerStrokeWidth + innerMargin)

        return <span className={cls}>
            <svg width={size} height={size} version="1.1" viewBox={`0 0 ${size} ${size}`}
                 xmlns="http://www.w3.org/2000/svg">

                <circle
                    className="rpb__svg__outline"
                    cx={center}
                    cy={center}
                    r={outerR}
                    stroke={color}
                    strokeWidth={outerStrokeWidth}
                />

                <AnimatedSector
                    className="rpb__svg__sector"
                    radius={innerR}
                    center={center}
                    angle={angle}
                    y0={outerStrokeWidth + innerMargin}
                    color={color}
                />

            </svg>
        </span>
    }
}

export default RadialProgressBar

//export default rotate(RadialProgressBar, 360, 1)
