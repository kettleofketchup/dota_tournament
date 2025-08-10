import { getLogger } from '~/lib/logger';

const log = getLogger('MaintainerSection');

export function MaintainerSection() {
  log.debug('Rendering MaintainerSection component');

  return (
    <div className="card bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 shadow-lg">
      <div className="card-body">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16">
              <span className="text-xl font-bold">K</span>
            </div>
          </div>
          <div>
            <h2 className="card-title text-2xl text-primary">Platform Maintainer</h2>
            <p className="text-base-content/70">Project Lead & Developer</p>
          </div>
        </div>

        <div className="bg-base-100 rounded-lg p-6 border border-primary/10">
          <h3 className="text-xl font-semibold text-accent mb-3">Kettleofketchup</h3>
          <p className="text-base-content mb-4">
            The driving force behind the DTX platform, Kettleofketchup is responsible for maintaining,
            developing, and continuously improving this guild management system. With a passion for both
            Dota 2 and software development, they ensure that DTX remains a cutting-edge solution for
            our gaming community.
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-primary">Full-Stack Developer</div>
            <div className="badge badge-secondary">Dota 2 Enthusiast</div>
            <div className="badge badge-accent">Community Builder</div>
          </div>
        </div>
      </div>
    </div>
  );
}
