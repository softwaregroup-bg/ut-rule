# UT Rule

Provides standard fees, limits and commissions API

## Factor abbreviations

* so - source organization
* do - destination organization
* co - channel organization
* ss - source spatial
* ds - destination spatial
* cs - channel spatial
* oc - operation category
* sc - source category
* dc - destination category


|  | Organizational (`actorId`) | Category | Spetial (`itemName`) | No factor<br/> Injected by `rule.decision.fetch`|
|--------------------------|--------------------------|----------|--------------------|-----------|
|<span style="color:#03A9F4">Source (S)</span>|*so - source organization*<br/><span style="color:#03A9F4">source</span>`.owner.id(^${level})`|*sc - source category*<br/><span style="color:#03A9F4">source</span>`.account.product`<br/><span style="color:#03A9F4">source</span>`.card.product`|*ss - source spatial*<br/><span style="color:#03A9F4">source</span>`.country`<br/><span style="color:#03A9F4">source</span>`.region`<br/><span style="color:#03A9F4">source</span>`.city`|<span style="color:#03A9F4">source</span>`.account.id`<br/><span style="color:#03A9F4">source</span>`.account.number`|
|<span style="color:#F44336">Destination (D)</span>|*do - destination organization*<br/><span style="color:#F44336">destination</span>`.owner.id(^${level})`|*dc - destination category*<br/><span style="color:#F44336">destination</span>`.account.product`|*ds - destination spatial*<br/><span style="color:#F44336">destination</span>`.country`<br/><span style="color:#F44336">destination</span>`.region`<br/><span style="color:#F44336">destination</span>`.city`|<span style="color:#F44336">destination</span>`.account.id`<br/><span style="color:#F44336">destination</span>`.account.number`|
|<span style="color:#FFC107">Channel (C)</span>|*co - channel organization*<br/><span style="color:#FFC107">channel</span>`.role(^${level})`<br/><span style="color:#FFC107">channel</span>`.id(^${level})`<br/><span style="color:#FFC107">agentof</span>`.id(^${level})`<br/>||*cs - channel spatial*<br/><span style="color:#FFC107">channel</span>`.country`<br/><span style="color:#FFC107">channel</span>`.region`<br/><span style="color:#FFC107">channel</span>`.city`||
|<span style="color:#4CAF50">Operation (O)</span>||*os - operation category*<br/><span style="color:#4CAF50">operation</span>`.id`||<span style="color:#4CAF50">operation</span>`.currency`|