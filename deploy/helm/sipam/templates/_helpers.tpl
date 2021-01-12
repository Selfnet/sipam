{{/*
Return the proper backend image name
*/}}
{{- define "sipam.backend.image" -}}
{{ include "common.images.image" (dict "imageRoot" .Values.backend.image "global" .Values.global) }}
{{- end -}}

{{/*
Return the proper frontend image name
*/}}
{{- define "sipam.frontend.image" -}}
{{ include "common.images.image" (dict "imageRoot" .Values.frontend.image "global" .Values.global) }}
{{- end -}}

{{/*
Return the proper Docker Image Registry Secret Names
*/}}
{{- define "sipam.imagePullSecrets" -}}
{{- include "common.images.pullSecrets" (dict "images" (list .Values.backend.image .Values.frontend.image) "global" .Values.global) -}}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "sipam.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (printf "%s-foo" (include "common.names.fullname" .)) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Compile all warnings into a single message.
*/}}
{{- define "sipam.validateValues" -}}
{{- $messages := list -}}
{{- $messages := append $messages (include "sipam.validateValues.foo" .) -}}
{{- $messages := append $messages (include "sipam.validateValues.bar" .) -}}
{{- $messages := without $messages "" -}}
{{- $message := join "\n" $messages -}}

{{- if $message -}}
{{-   printf "\nVALUES VALIDATION:\n%s" $message -}}
{{- end -}}
{{- end -}}

