import { html } from 'lit';

export const loadingScheduleRender = ()=>{
	return html`
		<div style="width:100px;height:4px;position: relative;overflow:hidden;--com-load-zhu-se:var(--stxui-theme-color, #02b6a6);--com-load-fu-se:#f6eddc;">
			<div style="position: absolute;width:100px;left:-25px;top:-99px;transform:scale(0.5);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="201"
				height="201" style="shape-rendering: auto; display: block; background: rgb(255, 255, 255);">
				<g data-idx="1">
					<defs data-idx="2">
						<pattern height="100" width="100" y="0" x="0" patternUnits="userSpaceOnUse" id="$id-pattern"
							data-idx="3">
							<g data-idx="4" transform="matrix(1,0,0,1,16.86655044555664,0)">
								<g transform="matrix(1.127631189751126,0.41042418829959376,-0.41042418829959376,1.127631189751126,20.116376126988012,-14.08563820557886)"
									data-idx="5">
									
									
									
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="-20" data-idx="6"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="-10" data-idx="7"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="0" data-idx="8"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="10" data-idx="9"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="20" data-idx="10"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="30" data-idx="11"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="40" data-idx="12"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="50" data-idx="13"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="60" data-idx="14"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="70" data-idx="15"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="80" data-idx="16"></rect>
									<rect fill="var(--com-load-zhu-se)" height="120" width="10" y="-10" x="90" data-idx="17"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="100" data-idx="18"></rect>
									<rect fill="var(--com-load-fu-se)" height="120" width="10" y="-10" x="110" data-idx="19"></rect>
									
									
									
								</g>
								<animateTransform attributeName="transform" type="translate" values="0 0;26 0"
									keyTimes="0;1" ng-attr-dur="{{config.speed}}s" repeatCount="indefinite" dur="0.35s">
								</animateTransform>
							</g>
						</pattern>
					</defs>
					<rect fill="url(#$id-pattern)" height="5" width="100" stroke-width="0" stroke="#ffffff" y="47.5" x="0"
						ry="0" rx="0" data-idx="21"></rect>
					<g data-idx="22"></g>
				</g>
				<text data-watermark="true" text-anchor="middle" dominant-baseline="middle" stroke-opacity="0.1"
					fill="black" fill-opacity="0.1" stroke="white" stroke-width="1" font-size="5.0" x="50" y="50"
					data-idx="23" style="opacity: 1; font-size: 5px;"></text>
			</svg>
			</div>
		</div>
	`;
};