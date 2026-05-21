# krita_clipping_layers
Krita mod with clipping layers feature

This is clipping commit initialy started by Radian-art, fixed and completed to usable state by uvhat (me)
And also here is more things for better approach drawing in krita to my habits from Illust Studio and SAI

This build is based on stable 5.3.1.1 version using QT5.

<img width="400" alt="clipped_layers" src="https://github.com/user-attachments/assets/aabae6c7-aa8c-48dd-9245-6a3cb4fe3a49" />


Differences:
1) clipping layers - same as in SAI/IllustStudio/PS/CSP/mdiapp based and others. current state:
-clipping for usual layers and folder layers - working and fast
-clipping for filter layers - slower than usual alpha inherit but usable at least for 1-2 filters layers. it could be accelerated with caching stack below filter layers but not much.
-clipping for layers with heavy styles (drop shadows, glows, pattern fills etc) - uh, this works but very laggy and slow because styles requires to rebuild all clipping stack to layer projections, i don't know smart solution here.
-caching of clipping layer group/stack projection from base to upper layer in stack
-masks should works too
-interface has al needed changes for clipping layers management
-alpha inherit don't changed, you can choose to use both features for your needs.

in general it works fine for usual drawing without extra using filters, fill/pattern layers and etc 

2) Added additional stabiliser smoothing with pos-release stroke tail fading (taper/haraiso). I felt very bad trying to draw in Krita without postrelease tail fading, as it was in Illust Studio or CSP. That's why i added it. Some stabiliser settings override added to brush configs, so you can choose to use global settings or to set it per brush, same as in CSP.

3) Also added experimental workaround for soft brushes - Smoothed dabs overlaps. In CSP/IllustStudio stroke is builded in high precision mode (i think it is at least 16 bit per channel) and only after stroke builded - it is converted to 8bit per channel and comitted to canvas layer data. This is reducing banding and fish retina pattern caused by precision error, that we can see in Krita in 8 bit mode. SAI2 using 16bit mode for everything internaly, so it is completely free from banding errors on soft brush strokes, but intreface is still using 8 bit colors and user operates colors in 8 bit model. Krita has 16 bit mode but it is way too slow compared to SAI and CSP and using 16 bit interface and UI, so this is very uncomfy, so in 8 bit mode users had only option to masking issue with high dithering...

<img width="400" alt="krita_soft_brushes11" src="https://github.com/user-attachments/assets/1d1eeb77-a9a0-43f1-b84a-7b87710332a3" />


I added simplified building stroke in 16 bit mode, and convertion at end to 8 bit, this approach is close to CSP/IllustStudio approach. It is faster than using 16 bit mode, more accurate and smooth compared to dithering workaround and still using 8 bit coloring, but a bit slower than using 8 bit mode. This is per-brush setting.

<img width="400" alt="smooth_dabs" src="https://github.com/user-attachments/assets/0be4f601-e861-4084-81f2-f74cb6b1056b" />


4) Another related fix for soft brushes - fixed fading of gaussian mask for auto brushes. In Krita gaussian mask with max softness setting never reaches zero value - it usually stucks on 2-3 (in 8 bit) for large brushes diameters, and this cause a very noticeable "border" or additional banding pattern on dabs overlaps areas. I adjusted gaussian mask calculation to allow it fade to zero smoothly.

5) Added new blending mode - Wash Alpha Build. This is identical to CSP/IllustStudio "with maximum overlap" mode and creates much better blending for soft brushes with preventing alpha accumulation between dabs in the same stroke. The usual Krita Wash mode has an issue - when you draw low opacity segment of stroke above already drawn high opacity segment of stroke this creates incorrect and weird "border" or "gap". This makes building smooth soft gradients extremely hard compared to how CSP/IllustStudio do this in max overlap mode. This issue resolved in Wash Alpha Build.

Krita Wash:
<img width="400" alt="wash_gaps_krita" src="https://github.com/user-attachments/assets/23b8703c-ddf1-4dc3-8f81-c83f85b7305c" />

IS max overlap:
<img width="400" alt="wash_gaps_illuststudio" src="https://github.com/user-attachments/assets/2a0dd679-4976-4bdb-81d6-2036a37b76d4" />

New Wash Alpha:
<img width="400" alt="wash_gaps_krita_limited_alpha_blend" src="https://github.com/user-attachments/assets/f4827d1d-694f-4195-9ac0-1da09431633b" />

So technically this is just a build-up mode with opacity multiplied by max opacity of settings, so it keep max opacity limited by settings, but accumulate alpha and dabs same as build-up mode.

7) Added better set for overview buttons and mirror X and Y actions. Krita has no Y mirror, only X mirror. So added both actions, shortcuts, and buttons on overview. You can now draw with one had with full control of canvas through overview buttons.

8) Added KRITA_DISABLE_SYNC_EVENTS env variable for skipping unnecessary input events from heavy python plugins (Pigment O for example) which cause significant slow down of krita interface. There was a commit in Krita in 5.3.0+ that forces app to catch all inputs from python plugins. This caused to react Krita for any event. And some plugins spams them a lot. You can set this env variable in shortcut and launch krita with old plugins without stutters.

9) Small fix for Wrap transform tool - preview is broken when you switch transform tool to wrap mode in 5.3.1

10) added fast box blur mode for filter brush. Krita has only slow gaussian and box blur filter with common convolution kernel. Added more suitable mode - fast box blur with sliding window. Combined with gaussian mask and accumulation mode it makes blur processing that close to gaussian blur in other apps and in the same time it works much faster and practically usable even for large brush. Also it add link for width of kernel to current brush size with pressure respond, same as in CSP/IllustStudio.

<img width="400" alt="fast_blur_g" src="https://github.com/user-attachments/assets/e8da5a03-cae3-4f77-bc74-286eecb1504c" />



You can build krita with commits that i included as patches and look and work with them as you wish.
