import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, {css} from 'styled-components'

import { ReduxState, setPrimaryEducationVisibility, setSecondaryEducationVisibility } from 'store'
import { CrossIcon, FilterIcon } from 'icons'
import { colors } from '../constants'

import educationPrimaryIcon from 'assets/education-primary.svg'
import educationSecondaryIcon from 'assets/education-secondary.svg'

const StyledContainer = styled.div`
	position: relative;
`

const StyledFilter = styled.div<{isEditing: boolean, active: boolean, contentHeight: number}>`
	position: absolute;
	pointer-events: auto;
	width: 100%;
	top: ${(props) => ((props.active ? props.contentHeight : 0) + 60) * -1}px;
	transition: 400ms;
	
	${(props) => props.isEditing && css`
		@media (max-width: 900px) {
			top: 0;
		}
	`}
`

const StyledHeader = styled.div<{active: boolean}>`
	${(props) => !props.active && css`
		cursor: pointer;
	`};
	background-color: ${(props) => props.active ? colors.red : '#fff'};
	height: 60px;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-radius: 30px 30px 0 0;
	transition: 200ms;
	
	p {
		color: ${(props) => props.active ? '#fff' : '#000'};
		padding-left: 1rem;
		flex: 1;
	}
`

const StyledIconContainer = styled.div`
	cursor: pointer;
	position: relative;
	width: 60px;
	height: 60px;
`

const StyledIcon = styled.div<{visible: boolean, index: 0 | 1, active: boolean}>`
	position: absolute;
	top: 50%;
	left: 50%;
	${(props) => props.visible ? css`
		transform: translate(-50%, -50%)
	` : (props.index === 0 ? css`
		transform: translate(-25%, -50%)
	` : css`
		transform: translate(-75%, -50%)
	`)};
	transition: 200ms;
	opacity: ${(props) => props.visible ? 1 : 0};
	color: ${(props) => props.active ? '#fff' : '#000'};
`

const StyledContent = styled.div`
	padding: 1rem;
	background-color: #fff;
`

const StyledFilterInfo = styled.p`
	opacity: .25
`

const StyledFilterOptionContainer = styled.div`
	margin-bottom: 1rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
`

const StyledFilterOption = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	
	@media (min-width: 500px) {
		:not(:last-child) {
			margin-right: .5rem;
		}
	}
	@media (max-width: 500px) {
		:not(:last-child) {
			margin-bottom: .5rem;
		}
	}
	
	p {
		margin-right: .25rem;
	}
`

const StyledMarkerIcon = styled.img`
	margin-right: .5rem;
`

const StyledLabel = styled.p<{disabled: boolean}>`
	flex: 1;
	
	${(props) => props.disabled && css`
		opacity: .5;
	`};
`

const StyledToggle = styled.label`
	position: relative;
	display: block;
	width: 60px;
	height: 34px;
	flex-shrink: 0;
`

const StyledToggleInput = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`

const StyledToggleVirtual = styled.span`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #d8d8d8;
	transition: 200ms;
	border-radius: 99px;
	
	:disabled {
		opacity: .5;
		cursor: auto;
	}
	
	:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: #fff;
		transition: 200ms;
		border-radius: 99px;
	}
	
	${StyledToggleInput}:checked + & {
		background-color: #000;
		
		:before {
			transform: translateX(26px);
		}
	}
`

interface StateProps {
	primaryEducationVisible: ReduxState['application']['primaryEducationVisible']
	secondaryEducationVisible: ReduxState['application']['secondaryEducationVisible']
	primaryEducation: ReduxState['poi']['primaryEducation']
	secondaryEducation: ReduxState['poi']['secondaryEducation']
}
interface DispatchProps {
	setPrimaryEducationVisibility: typeof setPrimaryEducationVisibility
	setSecondaryEducationVisibility: typeof setSecondaryEducationVisibility
}
interface Props {
	isEditing: boolean
}
type PropsUnion = StateProps & DispatchProps & Props

interface State {
	active: boolean,
	height: number
}

export class Component extends React.Component<PropsUnion, State> {
	public readonly state: State = {
		active: false,
		height: 0
	}
	public contentRef = React.createRef<HTMLDivElement>()

	public componentDidMount(): void {
		this.storeContentSize()
		window.addEventListener('resize', this.storeContentSize)
	}

	public storeContentSize = () => {
		if (!this.contentRef.current) return
		this.setState({
			height: this.contentRef.current.getBoundingClientRect().height
		})
	}

	public render() {
		const {active, height} = this.state
		const {isEditing} = this.props
		return (
			<StyledContainer>
				<StyledFilter active={active} contentHeight={height} isEditing={isEditing}>
					<StyledHeader active={active} onClick={() => !active && this.setState({active: true})}>
						<p>Points of interest</p>
						<StyledIconContainer onClick={() => active && this.setState({active: false})}>
							<StyledIcon active={active} visible={!active} index={0}>
								<FilterIcon/>
							</StyledIcon>
							<StyledIcon active={active} visible={active} index={1}>
								<CrossIcon/>
							</StyledIcon>
						</StyledIconContainer>
					</StyledHeader>
					<StyledContent ref={this.contentRef}>
						{this.renderFilterContent()}
					</StyledContent>
				</StyledFilter>
			</StyledContainer>
		)
	}

	private renderFilterContent() {
		return (
			<>
				<StyledFilterOptionContainer>
					<StyledFilterOption>
						<StyledMarkerIcon src={educationPrimaryIcon} alt='Primary education icon'/>
						<StyledLabel disabled={!(this.props.secondaryEducation && this.props.secondaryEducation.length > 0)}>Primary education</StyledLabel>
						<StyledToggle>
							<StyledToggleInput
								type='checkbox'
								defaultChecked={this.props.primaryEducationVisible}
								disabled={!(this.props.primaryEducation && this.props.primaryEducation.length > 0)}
								onChange={(e) => this.props.setPrimaryEducationVisibility(e.target.checked)}
							/>
							<StyledToggleVirtual/>
						</StyledToggle>
					</StyledFilterOption>
					<StyledFilterOption>
						<StyledMarkerIcon src={educationSecondaryIcon} alt='Secondary education icon'/>
						<StyledLabel disabled={!(this.props.secondaryEducation && this.props.secondaryEducation.length > 0)}>Secondary education</StyledLabel>
						<StyledToggle>
							<StyledToggleInput
								type='checkbox'
								defaultChecked={this.props.secondaryEducationVisible}
								disabled={!(this.props.secondaryEducation && this.props.secondaryEducation.length > 0)}
								onChange={(e) => this.props.setSecondaryEducationVisibility(e.target.checked)}
							/>
							<StyledToggleVirtual/>
						</StyledToggle>
					</StyledFilterOption>
				</StyledFilterOptionContainer>
				<StyledFilterInfo>Markers are only visible on lower zoom levels</StyledFilterInfo>
			</>
		)
	}
}

const mapStateToProps = (state: ReduxState) => ({
	primaryEducationVisible: state.application.primaryEducationVisible,
	secondaryEducationVisible: state.application.secondaryEducationVisible,
	primaryEducation: state.poi.primaryEducation,
	secondaryEducation: state.poi.secondaryEducation
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
	setPrimaryEducationVisibility,
	setSecondaryEducationVisibility
}, dispatch)

export const Filter = connect<StateProps, DispatchProps, Props, ReduxState>(
	mapStateToProps,
	mapDispatchToProps
)(Component)
