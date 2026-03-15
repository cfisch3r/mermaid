grammar ContextMap
import "../common/common";

entry ContextMap:
  NEWLINE*
  "contextMap"
  (
    NEWLINE
    | TitleAndAccessibilities
    | contexts+=Context
    | partnerships+=Partnership
    | upstreamDownstreamRelationships+=UpstreamDownstreamRelationship
  )*
;

Context:
  "context" name=ID EOL
;

Partnership:
  one=ID PARTNERSHIP_ARROW other=ID EOL
;

UpstreamDownstreamRelationship:
  from=ID UPSTREAM_DOWNSTREAM_ARROW to=ID EOL
;

terminal PARTNERSHIP_ARROW: '<->';
terminal UPSTREAM_DOWNSTREAM_ARROW: '-->';
